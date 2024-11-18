import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-cres',
  templateUrl: './cres.page.html',
  styleUrls: ['./cres.page.scss'],
})
export class CresPage implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  chart: Highcharts.Chart;
  ohlc: any[] = [];
  volume: any[] = [];
  dataSubscription: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load initial historical data
    this.loadChartData('historical');
    this.dataSubscription = interval(10000).subscribe(() => {
      this.fetchLiveStockData();
    });
    this.dataSubscription.unsubscribe(); // Disable live updates initially
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadChartData(dataType: string): void {
    if (dataType === 'historical') {
      this.fetchHistoricalStockData();
    } else if (dataType === 'live') {
      this.fetchLiveStockData();
    }
  }

  fetchHistoricalStockData(): void {
    this.http.get<any>('http://localhost:5000/stock/historical/^NSEI').subscribe(data => {
      this.processStockData(data);
    });
  }

  fetchLiveStockData(): void {
    if (this.dataSubscription.closed) {
      this.dataSubscription = interval(10000).subscribe(() => {
        this.fetchLiveStockData();
      });
    }
    this.http.get<any>('http://localhost:5000/stock/live/^NSEI').subscribe(data => {
      this.processStockData(data);
    });
  }

  processStockData(data: any): void {
    const ohlcData = [];
    const volumeData = [];

    Object.keys(data.Open).forEach(key => {
      const timestamp = new Date(key).getTime();
      ohlcData.push([
        timestamp,
        data.Open[key],
        data.High[key],
        data.Low[key],
        data.Close[key]
      ]);

      volumeData.push([
        timestamp,
        data.Volume[key]
      ]);
    });

    this.ohlc = ohlcData;
    this.volume = volumeData;
    this.initializeChart();
  }

  initializeChart(): void {
    this.chartOptions = {
      rangeSelector: { selected: 1 },
      title: { text: 'Nifty50' },
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
        name: 'Nifty50',
        data: this.ohlc,
        zIndex: 2,
        color: '#FF0000',
        upColor: '#00FF00'
      }, {
        type: 'column',
        name: 'Volume',
        data: this.volume,
        yAxis: 1
      }]
    };

    this.chart = Highcharts.stockChart('chart-container', this.chartOptions);
  }
}
