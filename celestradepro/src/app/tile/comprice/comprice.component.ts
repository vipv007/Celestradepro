import { Component, OnInit } from '@angular/core';
import { CommodityService } from 'src/app/services/co_avg.service';
import { UserService } from '../../services/user.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-comprice',
  templateUrl: './comprice.component.html',
  styleUrls: ['./comprice.component.scss'],
})
export class CompriceComponent implements OnInit {
  selectedCommodity: string = ''; 
  commodityData: any[] = [];
  lineChart: any;
  watchlistSymbols: string[] = []; 

  symbolToCommodityName = {
    'GC=F': 'Gold',
    'SI=F': 'Silver',
    'CL=F': 'Oil',
    // Add more mappings as needed
  };

  constructor(private commodityService: CommodityService, private userService: UserService) {}

  ngOnInit() {
    this.fetchWatchlistSymbols();
  }

  fetchWatchlistSymbols() {
    const email = this.userService.getEmail();
    
    if (email) {
      this.userService.getWatchlist(email).subscribe((response: any) => {
        console.log('Full Watchlist Data:', response.watchlist);

        this.watchlistSymbols = response.watchlist
          .filter((item: any) => this.symbolToCommodityName.hasOwnProperty(item.symbol))
          .map((item: any) => item.symbol);

        console.log('Filtered Watchlist Symbols (Commodities):', this.watchlistSymbols);

        if (this.watchlistSymbols.length > 0) {
          this.selectedCommodity = this.watchlistSymbols[0]; 
          console.log('Selected Commodity:', this.selectedCommodity);
          this.fetchData();
        } else {
          console.log('No valid commodity symbols found in the watchlist.');
        }
      });
    } else {
      // No user logged in, fetch the first available commodity data
      console.log('No user logged in, fetching default commodity data.');
      this.fetchDefaultCommodityData();
    }
  }

  fetchDefaultCommodityData() {
    // You can fetch a default commodity like 'Gold' if you have such logic
    this.selectedCommodity = 'SI=F'; // Or select another default commodity symbol

    this.commodityService.getCommodityData(this.selectedCommodity).subscribe(
      data => {
        this.commodityData = data;
        console.log('Fetched Default Commodity Data:', this.commodityData);
        this.createChart();
      },
      error => {
        console.error('Error fetching default commodity data:', error);
      }
    );
  }

  fetchData() {
    if (this.selectedCommodity) {
      console.log('Fetching data for selected commodity:', this.selectedCommodity);
      this.commodityService.getCommodityData(this.selectedCommodity).subscribe(
        data => {
          this.commodityData = data;
          console.log('Fetched Commodity Data:', this.commodityData);
          this.createChart();
        },
        error => {
          console.error('Error fetching commodity data:', error);
        }
      );
    } else {
      console.log('No commodity selected to fetch data for.');
    }
  }

  createChart() {
    if (this.lineChart) {
      this.lineChart.destroy();
    }

    if (this.commodityData.length === 0) {
      console.log('No data available for the selected commodity. Chart will not be created.');
      return;
    }

    const labels = this.commodityData.map(data => new Date(data.date).toLocaleDateString());
    const smaValues = this.commodityData.map(data => data.sma20);
    const emaValues = this.commodityData.map(data => data.ema20);

    this.lineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'SMA (20-day)',
            data: smaValues,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
          },
          {
            label: 'EMA (20-day)',
            data: emaValues,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day'
            },
            scaleLabel: {
              display: true,
              labelString: 'Date'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }]
        }
      }
    });
  }
}
