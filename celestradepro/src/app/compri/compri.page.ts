import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { CommodityService } from '../services/comprice.service';
import { UserService } from '../services/user.service';

const symbolToCommodityName = {
  'GC=F': 'Gold',
  'SI=F': 'Silver',
  'CL=F': 'Oil',
  // Add more mappings as needed
};

@Component({
  selector: 'app-compri',
  templateUrl: './compri.page.html',
  styleUrls: ['./compri.page.scss'],
})
export class CompriPage implements OnInit {

  chart: any;
  watchlistSymbols: string[] = []; // To store watchlist symbols
  isLoggedIn: boolean = false; // Track login status

  constructor(private commodityService: CommodityService, private userService: UserService) {}

  ngOnInit() {
    // Check if the user is logged in and fetch data accordingly
    this.checkUserLogin();
  }

  // Check if the user is logged in
  checkUserLogin() {
    const email = this.userService.getEmail(); // Get the user's email from the service

    if (email) {
      this.isLoggedIn = true; // Set login status
      this.fetchWatchlistSymbols(email); // If logged in, fetch watchlist symbols
    } else {
      this.isLoggedIn = false; // If not logged in, fetch default data
      this.fetchDefaultCommodityData(); // Fetch the first record from the commodity collection
    }
  }

  // Fetch watchlist symbols for the logged-in user
  fetchWatchlistSymbols(email: string) {
    this.userService.getWatchlist(email).subscribe((response: any) => {
      this.watchlistSymbols = response.watchlist.map((item: any) => item.symbol);
      console.log('Watchlist Symbols:', this.watchlistSymbols); // Debug log
      // After fetching the watchlist, fetch the commodity data and filter it
      this.fetchFilteredCommodities();
    });
  }

  // Fetch the default commodity data (first record in collection)
  fetchDefaultCommodityData() {
    this.commodityService.getCommodities().subscribe(data => {
      console.log('Fetched Commodities:', data); // Debug log
      if (data.length > 0) {
        // Use the first record in the data collection if no user is logged in
        const defaultData = [data[0]]; 
        console.log('Default Data:', defaultData); // Debug log
        this.createChart(defaultData);
      } else {
        console.warn('No commodity data available.');
      }
    });
  }

  // Fetch and filter commodities based on the user's watchlist
  fetchFilteredCommodities() {
    this.commodityService.getCommodities().subscribe(data => {
      console.log('Fetched Commodities:', data); // Debug log
      // Map the symbols to the corresponding commodity names
      const filteredData = data.filter((item: any) =>
        this.watchlistSymbols.some(symbol => symbolToCommodityName[symbol] === item.name)
      );
      console.log('Filtered Data:', filteredData); // Debug log
      this.createChart(filteredData);
    });
  }

  // Create the chart based on the provided data
  createChart(data: any) {
    const ctx = document.getElementById('volatilityChart') as HTMLCanvasElement;

    if (data.length === 0) {
      console.warn('No data available for the selected watchlist symbols'); // Warn if no data
      return;
    }

    const datasets = data.map((item: any) => ({
      label: item.name,
      data: item.data.map((row: any) => ({ x: new Date(row.Date), y: row.Volatility })),
      borderColor: this.getRandomColor(),
      fill: false
    }));

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: datasets
      },
      options: {
        title: {
          display: true,
          text: 'Commodity Price Volatility'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'month'
            },
            scaleLabel: {
              display: true,
              labelString: 'Date'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Volatility'
            }
          }]
        }
      }
    });
  }

  // Generate random color for chart lines
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
