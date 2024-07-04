import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { RatioService } from '../../services/ratio.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit {

  ratios: any[] = [];
  selectedFields: string[] = [];
  selectedSymbols: string[] = [];

  constructor(private ratioService: RatioService, private stockService: StockService) {}

   ngOnInit() {
    // Fetch selected stocks from the stock database
    this.stockService.getSelectedStocks().subscribe((selectedStocks: any[]) => {
      // Extract symbols of selected stocks
      this.selectedSymbols = selectedStocks
        .filter(stock => stock.selected)
        .map(stock => stock.symbol);

      // Check if any symbols are selected
      if (this.selectedSymbols.length > 0) {
        this.fetchRatiosForSelectedSymbols();
      } else {
        console.log('No symbols selected.');
        // Handle the case where no symbols are selected
      }
    });
  }

  fetchRatiosForSelectedSymbols() {
    // Fetch all ratios
    this.ratioService.getAllRatios().subscribe((response: any[]) => {
      // Filter ratios for each selected symbol
      this.selectedSymbols.forEach(symbol => {
        const selectedRatios = response.filter(ratio => ratio.symbol === symbol);
        console.log('Selected Ratios for', symbol + ':', selectedRatios);
        // Concatenate the fetched ratios with existing ratios array
        this.ratios = this.ratios.concat(selectedRatios);
      });
      // Update chart after fetching ratios for all selected symbols
      this.updateChart();
    });
  }

  

  toggleData(field: string) {
    if (this.selectedFields.includes(field)) {
      this.selectedFields = this.selectedFields.filter(f => f !== field);
    } else {
      this.selectedFields.push(field);
    }
    this.updateChart();
  }

  updateChart() {
    const datasets = [];

    this.selectedFields.forEach(field => {
      datasets.push({
        label: field,
        data: this.ratios.map(item => item.metrics[field]),
        backgroundColor: this.getBackgroundColorForField(field),
      });
    });

    const ctx = <HTMLCanvasElement>document.getElementById('cylinderChart');
    let myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: this.ratios.map(item => item.symbol),
        datasets,
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

    // Destroy the existing chart instance before creating a new one
    if (myChart) {
      myChart.destroy();
    }

    myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: this.ratios.map(item => item.symbol),
        datasets,
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

  getBackgroundColorForField(field: string): string {
    switch (field) {
      case 'P/B':
        return '#cc8424';
      case 'P/E':
        return '#2dbdc7';
      case 'Forward P/E':
        return '#ecb59c';
      case 'PEG':
        return '#9c8459';
      case 'Debt/Eq':
        return '#bca471';
      case 'EPS (ttm)':
        return '#d44133';
      case 'Dividend %':
        return '#ecb59c';
      case 'ROE':
        return '#b78167';
      case 'ROI':
        return '#cf9c90';
      case 'EPS Q/Q':
        return 'rgba(153, 102, 255, 0.2)';
      case 'Insider Own':
        return 'rgba(54, 162, 235, 0.2)';
      default:
        return '';
    }
  }
}