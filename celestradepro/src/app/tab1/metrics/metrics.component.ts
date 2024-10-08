import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { RatioService } from '../../services/ratio.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit, OnDestroy {

  ratios: any[] = [];
  selectedFields: string[] = ['P/B']; // P/B selected by default
  watchlistSymbols: string[] = [];
  private myChart: Chart;

  constructor(
    private ratioService: RatioService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Fetch watchlist symbols from the user's collection or default data
    this.fetchWatchlistSymbols();
  }

  ngOnDestroy() {
    // Destroy the chart instance when the component is destroyed
    if (this.myChart) {
      this.myChart.destroy();
    }
  }

  fetchWatchlistSymbols() {
    const email = this.userService.getEmail(); // Get the user's email from the service
    
    if (email) {
      // User is logged in, fetch watchlist symbols
      this.userService.getWatchlist(email).subscribe((response: any) => {
        this.watchlistSymbols = response.watchlist.map((item: any) => item.symbol);
        if (this.watchlistSymbols.length > 0) {
          this.fetchRatiosForWatchlistSymbols();
        } else {
          console.log('No symbols in watchlist.');
          // Handle the case where no symbols are in the watchlist
          this.fetchRatiosForDefaultSymbol();
        }
      });
    } else {
      // User is not logged in, fetch data for default symbol
      this.fetchRatiosForDefaultSymbol();
    }
  }

  fetchRatiosForWatchlistSymbols() {
    // Fetch all ratios
    this.ratioService.getAllRatios().subscribe((response: any[]) => {
      // Filter ratios for each symbol in the watchlist
      this.watchlistSymbols.forEach(symbol => {
        const selectedRatios = response.filter(ratio => ratio.symbol === symbol);
        console.log('Selected Ratios for', symbol + ':', selectedRatios);
        // Concatenate the fetched ratios with the existing ratios array
        this.ratios = this.ratios.concat(selectedRatios);
      });
      // Update chart after fetching ratios for all selected symbols
      this.updateChart();
    });
  }

  fetchRatiosForDefaultSymbol() {
    // Fetch ratios for a default symbol (e.g., 'AAPL')
    this.ratioService.getAllRatios().subscribe((response: any[]) => {
      // Get the first two items from the response
      this.ratios = response.slice(0, 1); // Fetch only the first two items
      this.updateChart();
    }, error => {
      console.error('Failed to fetch default stock data:', error);
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

    // Destroy the existing chart instance before creating a new one
    if (this.myChart) {
      this.myChart.destroy();
    }

    this.myChart = new Chart(ctx, {
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
