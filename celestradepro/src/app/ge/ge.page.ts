import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ge',
  templateUrl: './ge.page.html',
  styleUrls: ['./ge.page.scss'],
})
export class GEPage implements OnInit {
  data = [
    { company: "Apple Inc.", symbol: "AAPL", change: 2.5, latest_price: 150, volume: 5000000, oi: 100000 },
    { company: "Microsoft Corp.", symbol: "MSFT", change: 1.2, latest_price: 250, volume: 3000000, oi: 80000 },
    { company: "Amazon.com Inc.", symbol: "AMZN", change: -1.8, latest_price: 3200, volume: 7000000, oi: 200000 },
    { company: "Alphabet Inc.", symbol: "GOOGL", change: 0.3, latest_price: 2800, volume: 2000000, oi: 150000 },
    { company: "Facebook Inc.", symbol: "META", change: -0.5, latest_price: 330, volume: 4000000, oi: 50000 },
    { company: "Tesla Inc.", symbol: "TSLA", change: 3.4, latest_price: 700, volume: 6000000, oi: 120000 },
    { company: "Berkshire Hathaway", symbol: "BRK.B", change: -2.1, latest_price: 290, volume: 1000000, oi: 40000 },
    { company: "Johnson & Johnson", symbol: "JNJ", change: 0.0, latest_price: 160, volume: 3000000, oi: 60000 },
    { company: "Visa Inc.", symbol: "V", change: 1.7, latest_price: 230, volume: 2500000, oi: 90000 },
    { company: "Walmart Inc.", symbol: "WMT", change: -0.9, latest_price: 140, volume: 3500000, oi: 110000 },
    // Additional Nifty 50 companies
    { company: "Reliance Industries", symbol: "RELIANCE", change: 2.0, latest_price: 2100, volume: 5000000, oi: 150000 },
    { company: "HDFC Bank", symbol: "HDFCBANK", change: -0.3, latest_price: 1450, volume: 3500000, oi: 95000 },
    { company: "Infosys Ltd.", symbol: "INFY", change: 1.5, latest_price: 1600, volume: 4000000, oi: 120000 },
    { company: "Tata Consultancy Services", symbol: "TCS", change: 0.8, latest_price: 3200, volume: 2500000, oi: 80000 },
    { company: "Kotak Mahindra Bank", symbol: "KOTAKBANK", change: -1.2, latest_price: 1900, volume: 3000000, oi: 70000 },
    { company: "ICICI Bank", symbol: "ICICIBANK", change: 0.4, latest_price: 700, volume: 5000000, oi: 110000 },
    { company: "Hindustan Unilever", symbol: "HINDUNILVR", change: 0.7, latest_price: 2200, volume: 2000000, oi: 65000 },
    { company: "State Bank of India", symbol: "SBIN", change: -1.5, latest_price: 400, volume: 4500000, oi: 90000 },
    { company: "Bajaj Finance", symbol: "BAJFINANCE", change: 3.1, latest_price: 6200, volume: 500000, oi: 20000 },
    { company: "Axis Bank", symbol: "AXISBANK", change: 1.9, latest_price: 750, volume: 3000000, oi: 85000 }
  ];

  activeTab: string = 'price';

  constructor() { }

  ngOnInit(): void { }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getColor(change: number): string {
    if (change > 0) {
      let intensity = Math.min(change / 5, 1);  // Cap intensity at 1 for 5% change
      return `rgba(0, 255, 0, ${intensity})`;  // Green for positive
    } else if (change < 0) {
      let intensity = Math.min(-change / 5, 1);  // Cap intensity at 1 for -5% change
      return `rgba(255, 0, 0, ${intensity})`;  // Red for negative
    } else {
      return 'rgba(200, 200, 200, 0.5)';  // Grey for zero
    }
  }

  getTextColor(change: number): string {
    return change > 0 ? '#333' : '#444';
  }
}
