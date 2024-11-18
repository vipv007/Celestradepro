import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';

interface CommodityData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

@Component({
  selector: 'app-com-livedata',
  templateUrl: './com-livedata.component.html',
  styleUrls: ['./com-livedata.component.scss'],
})
export class ComLivedataComponent implements OnInit, OnDestroy {
  chartData: CommodityData[] = [];
  dataSubscription: Subscription;
  selectedCommoditySymbol: string = 'GC=F'; // Default commodity symbol
  readonly baseUrl = 'http://localhost:5000/commodity';
  commoditySymbols: string[] = ['GC=F', 'CL=F', 'SI=F', 'HG=F'];
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
    this.http.get<any>(`${this.baseUrl}/live/${this.selectedCommoditySymbol}`, {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    }).subscribe(
      data => this.processData(data),
      error => console.error('Error fetching live commodity data', error)
    );
  }

  // Process the fetched commodity data and update chartData
  private processData(data: any): void {
    const formattedData: CommodityData[] = [];

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
