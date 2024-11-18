import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';

interface ForexData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

@Component({
  selector: 'app-forexlive',
  templateUrl: './forexlive.component.html',
  styleUrls: ['./forexlive.component.scss'],
})
export class ForexliveComponent implements OnInit, OnDestroy {

  chartData: ForexData[] = [];
  dataSubscription: Subscription; 
  selectedForexSymbol: string = 'EURUSD=X'; // Default Forex symbol
  readonly baseUrl = 'http://localhost:5000/forex'; // Base URL for Forex endpoints
  
  forexSymbols: string[] = ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'AUDUSD=X']; // Add more symbols as needed
  
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

  // Fetch live data for the selected commodity symbol
  private fetchLiveData(): void {
    this.http.get<any>(`${this.baseUrl}/live/${this.selectedForexSymbol}`, {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    }).subscribe(
      data => this.processData(data),
      error => console.error('Error fetching live commodity data', error)
    );
  }

  // Process the fetched commodity data and update chartData
  private processData(data: any): void {
    const formattedData: ForexData[] = [];

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
