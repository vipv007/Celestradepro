import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';


interface StockData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

@Component({
  selector: 'app-stockmarket',
  templateUrl: './stockmarket.component.html',
  styleUrls: ['./stockmarket.component.scss'],
})
export class StockmarketComponent implements OnInit, OnDestroy {

  chartData: StockData[] = [];
  dataSubscription: Subscription;
  selectedCommoditySymbol: string = '^NSEI'; // Default symbol for Nifty 50
  readonly baseUrl = 'http://localhost:5000/stock/live/^NSEI'; // Nifty 50 symbol URL
  yAxisMin: number = 0;
  yAxisMax: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadChartData();
    this.setupLiveDataFetching();
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }

  // Set up periodic live data fetching
  private setupLiveDataFetching(): void {
    this.dataSubscription = interval(10000).subscribe(() => {
      this.fetchLiveData();
    });
  }

  // Clean up subscriptions on component destroy
  private cleanupSubscriptions(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // Load initial chart data
  private loadChartData(): void {
    this.fetchLiveData();
  }

  // Fetch live data for Nifty 50
  private fetchLiveData(): void {
    this.http.get<any>(`${this.baseUrl}`, {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    }).subscribe(
      data => this.processData(data),
      error => console.error('Error fetching live Nifty 50 data', error)
    );
  }

  // Process the fetched Nifty 50 data and update chartData
  private processData(data: any): void {
    const formattedData: StockData[] = [];

    // Convert API response data into format expected by igx-financial-chart
    Object.keys(data.Open).forEach(timestamp => {
      const date = new Date(timestamp);
      formattedData.push({
        date,
        open: data.Open[timestamp],
        high: data.High[timestamp],
        low: data.Low[timestamp],
        close: data.Close[timestamp],
        volume: data.Volume[timestamp]
      });
    });

    this.chartData = formattedData;

    // Update y-axis range based on the data range
    this.yAxisMin = Math.min(...formattedData.map(d => d.low));
    this.yAxisMax = Math.max(...formattedData.map(d => d.high));
  }
}
