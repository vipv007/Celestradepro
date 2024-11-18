import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-cre',
  templateUrl: './cre.page.html',
  styleUrls: ['./cre.page.scss'],
})
export class CrePage implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  chart: Highcharts.Chart;
  ohlc: any[] = [];
  volume: any[] = [];
  dataSubscription: Subscription;
  selectedCommoditySymbol: string = 'GC=F'; // Default commodity symbol (e.g., Gold futures)
  readonly baseUrl = 'http://localhost:5000/commodity'; // Base URL for Commodity endpoints

  commoditySymbols: string[] = ['GC=F', 'CL=F', 'SI=F', 'HG=F']; // Add more commodity symbols as needed

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadChartData();
    this.setupLiveDataFetching();
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }

  // Set up periodic live data fetching
  setupLiveDataFetching(): void {
    this.dataSubscription = interval(10000).subscribe(() => {
      this.fetchLiveData();
    });
  }

  // Clean up subscriptions on component destroy
  cleanupSubscriptions(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // Load live data for the selected commodity symbol
  loadChartData(): void {
    this.fetchLiveData();
  }

  // Fetch live data for the selected commodity symbol
  fetchLiveData(): void {
    this.http.get<any>(`${this.baseUrl}/live/${this.selectedCommoditySymbol}`, {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    }).subscribe(
      data => this.processData(data),
      error => console.error('Error fetching live commodity data', error)
    );
  }

  // Process the fetched commodity data and update the chart
  processData(data: any): void {
    const ohlcData = [];
    const volumeData = [];

    // Convert API response data into Highcharts-compatible format
    Object.keys(data.Open).forEach(timestamp => {
      const date = new Date(timestamp).getTime(); // Adjust for UTC if needed
      ohlcData.push([
        date,
        data.Open[timestamp],
        data.High[timestamp],
        data.Low[timestamp],
        data.Close[timestamp]
      ]);

      volumeData.push([date, data.Volume[timestamp]]);
    });

    this.ohlc = ohlcData;
    this.volume = volumeData;
    this.initializeChart();
  }

  // Initialize or update the chart with new data
  initializeChart(): void {
    this.chartOptions = {
      rangeSelector: { selected: 1 },
      title: { text: this.selectedCommoditySymbol },
      xAxis: { type: 'datetime' },
      yAxis: [{
        labels: { align: 'right', x: -3 },
        title: { text: 'OHLC' },
        height: '60%',
        lineWidth: 2
      }, {
        labels: { align: 'right', x: -3 },
        title: { text: 'Volume' },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],
      series: [{
        type: 'candlestick',
        name: this.selectedCommoditySymbol,
        data: this.ohlc,
        zIndex: 2,
        color: '#FF0000', // Red for down candles
        upColor: '#00FF00' // Green for up candles
      }, {
        type: 'column',
        name: 'Volume',
        data: this.volume,
        yAxis: 1
      }]
    };

    if (this.chart) {
      this.chart.update(this.chartOptions);
    } else {
      this.chart = Highcharts.stockChart('chart-container', this.chartOptions);
    }
  }
}
