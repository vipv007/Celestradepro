import { Component, OnInit } from '@angular/core';
import { EarningService } from '../../services/earning.service';
import { StockService } from '../../services/stock.service';
import { UserService } from '../../services/user.service';  // Import UserService to fetch user's watchlist
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

  constructor(
    private earningService: EarningService, 
    private stockService: StockService, 
    private userService: UserService  // Inject UserService
  ) {}

  ngOnInit() {
    this.checkLoginStatus();  // Check login status on init
  }

  checkLoginStatus(): void {
    const email = this.userService.getEmail();  // Get the user's email from the service
    
    if (email) {
      this.fetchUserSymbols();  // Fetch user's symbols
    } else {
      this.fetchEarningsForDefault(); // Fetch data for the first symbol in the default collection
    }
  }

  fetchUserSymbols(): void {
    const email = this.userService.getEmail();  // Get the user's email from the service
    this.userService.getWatchlist(email).subscribe(
      (response: any) => {
        this.selectedSymbols = response.watchlist.map((item: any) => item.symbol);
        if (this.selectedSymbols.length > 0) {
          this.fetchEarningsForSelectedStocks();  // Fetch earnings data for the user's symbols
        } else {
          console.log('No symbols selected.');
          // Handle the case where no symbols are selected
        }
      },
      error => {
        console.error('Error fetching user symbols:', error);
      }
    );
  }

  fetchEarningsForSelectedStocks(): void {
    this.earningService.getAllEarnings().subscribe((response: any[]) => {
      // Filter earnings data to include only the symbols in the user's watchlist
      this.earningsData = response.filter(item => this.selectedSymbols.includes(item.symbol));
      this.updateUniqueYears();
      this.initializeSelectedYears();
      this.generateChart();
      this.updateChart('2024');  // Default year
    });
  }

  fetchEarningsForDefault(): void {
    this.earningService.getAllEarnings().subscribe((response: any[]) => {
      // Check if there are any symbols in the response and use the first one
      if (response.length > 0) {
        const firstSymbol = response[0].symbol; // Get the first symbol from the response
        this.earningsData = response.filter(item => item.symbol === firstSymbol);
        this.updateUniqueYears();
        this.initializeSelectedYears();
        this.generateChart();
        this.updateChart('2024');  // Default year
      } else {
        console.log('No earnings data available.');
        // Handle the case where no earnings data is available
      }
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
      this.selectedYears[year] = (year === '2024'); // Default selection for 2024
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
