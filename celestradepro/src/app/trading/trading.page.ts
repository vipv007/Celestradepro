import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StockService } from '../services/stock.service';
import * as Plotly from 'plotly.js/dist/plotly.js';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.page.html',
  styleUrls: ['./trading.page.scss'],
})
export class TradingPage implements OnInit {
  @ViewChild('chart') chartElement: ElementRef;
  chart: any;
  fname: string;

  constructor(private stockService: StockService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.fname = params['symbol'];
      console.log('Received:', this.fname);
      // Call the chart creation function here after fname is populated
      this.createChartIfNeeded();
    });
  }

  ionViewDidEnter() {
    // Call the chart creation function again in case it wasn't called during ngOnInit
    this.createChartIfNeeded();
  }

  createChartIfNeeded() {
    if (this.fname) {
      this.stockService.getAllStocks().subscribe((response: any) => {
        const fxname = this.fname;
        console.log('Received:', fxname);
        const forex = response.find((entry) => entry.symbol === fxname);
        if (forex) {
          const ohlcData = forex.stock;
          console.log(ohlcData);
          this.createCandlestickChart(ohlcData, fxname);
        }
      });
    }
  }

  createCandlestickChart(ohlcData: any[], fxname: string) {
    // Process OHLC data for candlestick chart
    const dates = [];
    const opens = [];
    const highs = [];
    const lows = [];
    const closes = [];
    const volumes = [];

    ohlcData.forEach((doc) => {
      dates.push(moment(doc.Date).format('YYYY-MM-DD'));
      opens.push(doc.Open);
      highs.push(doc.High);
      lows.push(doc.Low);
      closes.push(doc.Close);
      volumes.push(doc.Volume);
    });

    // Enhanced Parabolic SAR, EMA 200, MACD logic from Pine Script
    const SAR = this.calculateParabolicSAR(ohlcData);
    const EMA_200 = this.calculateEMA200(closes);
    const MACD = this.calculateMACD(closes);
    const signal = this.calculateSignalLine(MACD);
    const delta = MACD.map((value, index) => value - signal[index]);

    // Buy and Sell signals
    const buySignals = SAR.map((value, index) => (value < lows[index] && this.crossOver(delta[index], 0) ? closes[index] : null));
    const sellSignals = SAR.map((value, index) => (value > highs[index] && this.crossUnder(delta[index], 0) ? closes[index] : null));

    const buySignalAnnotations = this.getSignalAnnotations(dates, buySignals, 'Buy Signal', 'green');
    const sellSignalAnnotations = this.getSignalAnnotations(dates, sellSignals, 'Sell Signal', 'red');

    // Create candlestick chart with additional indicators and signals
    const data = [
      {
        type: 'candlestick',
        x: dates,
        open: opens,
        high: highs,
        low: lows,
        close: closes,
        yaxis: 'y2',
        name: fxname,
        increasing: { line: { color: '#00C805' } },
        decreasing: { line: { color: '#FF3319' } },
      },
      {
        type: 'bar',
        x: dates,
        y: volumes,
        yaxis: 'y',
        name: 'Volume',
        marker: { color: '#F97B22' },
      },
      {
        type: 'scatter',
        mode: 'markers',
        x: dates,
        y: SAR,
        yaxis: 'y2',
        name: 'Parabolic SAR',
        marker: { color: '#FFD700', size: 6 },
      },
      {
        type: 'scatter',
        mode: 'lines',
        x: dates,
        y: EMA_200,
        yaxis: 'y2',
        name: 'EMA 200',
        line: { color: '#FF00FF' },
      },
      {
        type: 'scatter',
        mode: 'lines',
        x: dates,
        y: signal,
        yaxis: 'y2',
        name: 'Signal Line',
        line: { color: '#FF6D00' },
      },
      ...buySignalAnnotations,
      ...sellSignalAnnotations,
    ];

    // Layout and configuration
    const layout = {
      dragmode: 'zoom',
      xaxis: {
        rangeslider: {
          visible: false,
        },
      },
      yaxis: { domain: [0, 0.2], title: 'Volume' },
      yaxis2: { domain: [0.2, 1], title: fxname },
    };

    const config = {
      responsive: true,
    };

    // Remove existing chart (if any)
    if (this.chart) {
      Plotly.purge(this.chartElement.nativeElement);
    }

    // Create new chart
    this.chart = Plotly.newPlot(this.chartElement.nativeElement, data, layout, config);
  }

  getSignalAnnotations(dates: string[], signals: (number | null)[], label: string, color: string) {
    return signals
      .filter((signal) => signal !== null)
      .map((signal, index) => ({
        type: 'scatter',
        mode: 'markers',
        x: [dates[index]],
        y: [signal],
        marker: {
          symbol: 'arrow-up',
          size: 8,
          color,
        },
        text: label,
        name: label,
        yaxis: 'y2',
      }));
  }

  crossOver(a: number, b: number): boolean {
    return a > b;
  }

  crossUnder(a: number, b: number): boolean {
    return a < b;
  }

  calculateParabolicSAR(data: any[]): number[] {
    // Implement your calculation logic here
    // Placeholder implementation:
    return data.map((doc) => doc.High);
  }

  calculateEMA200(data: number[]): number[] {
    // Implement your calculation logic here
    // Placeholder implementation:
    return data.map((value) => value + 10);
  }

  calculateMACD(data: number[]): number[] {
    // Implement your calculation logic here
    // Placeholder implementation:
    return data.map((value) => value - 5);
  }

  calculateSignalLine(macdData: number[]): number[] {
    // Implement your calculation logic here
    // Placeholder implementation:
    return macdData.map((value) => value - 5);
  }
}
