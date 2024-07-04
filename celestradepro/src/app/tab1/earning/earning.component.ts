import { Component, OnInit } from '@angular/core';
import { EarningService } from '../../services/earning.service';
import { StockService } from '../../services/stock.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-earning',
  templateUrl: './earning.component.html',
  styleUrls: ['./earning.component.scss'],
})
export class EarningComponent implements OnInit {
  earningsData: any[] = [];
  chart: any;
  selectedSymbols: string[] = [];
  uniqueYears: string[] = [];
  selectedYears: { [key: string]: boolean } = {};

  constructor(private earningService: EarningService, private stockService: StockService) {}

  ngOnInit() {
    this.fetchDataAndGenerateChart();
  }

  fetchDataAndGenerateChart(): void {
    this.stockService.getSelectedStocks().subscribe((selectedStocks: any[]) => {
      this.selectedSymbols = selectedStocks
        .filter((stock: any) => stock.selected)
        .map((stock: any) => stock.symbol);

      if (this.selectedSymbols.length > 0) {
        this.fetchEarningsForSelectedStocks();
      } else {
        console.log('No symbols selected.');
        // Handle the case where no symbols are selected
      }
    });
  }

  fetchEarningsForSelectedStocks(): void {
    this.earningService.getAllEarnings().subscribe((response: any[]) => {
      this.earningsData = response.filter(item => this.selectedSymbols.includes(item.symbol));
      this.updateUniqueYears();
      this.initializeSelectedYears();
      this.generateChart();
    });
  }

  updateUniqueYears(): void {
    const allYears = this.earningsData.reduce((years, company) => {
      company.earning.forEach(earning => {
        years.add(earning.year.toString());
      });
      return years;
    }, new Set<string>());

    this.uniqueYears = Array.from(allYears);
  }

  initializeSelectedYears(): void {
    this.uniqueYears.forEach(year => {
      this.selectedYears[year] = false;
    });
  }

  updateChart(selectedYear: string): void {
    this.uniqueYears.forEach(year => {
      if (year !== selectedYear) {
        this.selectedYears[year] = false; // Deselect other years
      }
    });
  
    const { symbols, years, revenueData, forecastData, epsData } = this.prepareChartData();
    this.chart.data.labels = symbols; // Update x-axis labels with selected stock symbols
    this.chart.data.datasets[0].data = revenueData;
    this.chart.data.datasets[1].data = forecastData;
    this.chart.data.datasets[2].data = epsData;
    this.chart.update();
  }
  

  generateChart(): void {
    const { years, revenueData, forecastData, epsData } = this.prepareChartData();

    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Revenue',
            data: revenueData,
            backgroundColor: 'rgba(46, 204, 113, 0.8)',
            borderColor: 'rgba(46, 204, 113, 1)',
            borderWidth: 1
          },
          {
            label: 'Forecast',
            data: forecastData,
            backgroundColor: 'rgba(52, 152, 219, 0.8)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1
          },
          {
            label: 'EPS',
            data: epsData,
            backgroundColor: 'rgba(241, 196, 15, 0.8)',
            borderColor: 'rgba(241, 196, 15, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  prepareChartData(): { symbols: string[], years: string[], revenueData: number[], forecastData: number[], epsData: number[] } {
    const selectedYears = Object.keys(this.selectedYears).filter(year => this.selectedYears[year]);
    const symbols: string[] = [];
    const years: string[] = [];
    const revenueData: number[] = [];
    const forecastData: number[] = [];
    const epsData: number[] = [];
  
    selectedYears.forEach(selectedYear => {
      const filteredEarningsData = this.earningsData.filter(company =>
        company.earning.some(earning => earning.year.toString() === selectedYear)
      );
  
      filteredEarningsData.forEach(company => {
        if (!symbols.includes(company.symbol)) {
          symbols.push(company.symbol);
        }
        years.push(selectedYear);
  
        const yearEarnings = company.earning.find(earning => earning.year.toString() === selectedYear);
        revenueData.push(yearEarnings ? yearEarnings.revenue : 0);
        forecastData.push(yearEarnings ? yearEarnings.forecast : 0);
        epsData.push(yearEarnings ? yearEarnings.eps : 0);
      });
    });
  
    return { symbols, years, revenueData, forecastData, epsData };
  }
}  