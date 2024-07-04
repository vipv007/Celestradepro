import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
})
export class BillPage  {

  public barChartOptions: ChartOptions = {
      responsive: true,
    };
    public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartPlugins = [];
  
    public barChartData: ChartDataSets[] = [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
    ];
  
    addData() {
      this.barChartData[0].data.push(Math.floor(Math.random() * 100));
      this.barChartLabels.push(`Label ${this.barChartLabels.length + 1}`);
    }
  
    removeData() {
      this.barChartData[0].data.pop();
      this.barChartLabels.pop();
    }
  
    changeType() {
      this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
    }
  
    applyIndicator(event: Event) {
      const selectedIndicator = (event.target as HTMLSelectElement).value;
      switch (selectedIndicator) {
        case 'movingAverage':
          this.addMovingAverage();
          break;
        case 'exponentialMovingAverage':
          this.addExponentialMovingAverage();
          break;
        case 'bollingerBands':
          this.addBollingerBands();
          break;
        case 'macd':
          this.addMACD();
          break;
        case 'rsi':
          this.addRSI();
          break;
        case 'stochasticOscillator':
          this.addStochasticOscillator();
          break;
        case 'adx':
          this.addADX();
          break;
        case 'cci':
          this.addCCI();
          break;
        case 'atr':
          this.addATR();
          break;
        case 'envelope':
          this.addEnvelope();
          break;
      }
    }
  
    addMovingAverage() {
      const data = this.barChartData[0].data as number[];
      const movingAverage = this.calculateMovingAverage(data, 3); // Calculate 3-period moving average
      this.barChartData.push({
        data: movingAverage,
        label: 'Moving Average',
        type: 'line',
        borderColor: 'red',
        fill: false
      });
    }
  
    addExponentialMovingAverage() {
      const data = this.barChartData[0].data as number[];
      const ema = this.calculateExponentialMovingAverage(data, 3); // Calculate 3-period EMA
      this.barChartData.push({
        data: ema,
        label: 'Exponential Moving Average',
        type: 'line',
        borderColor: 'blue',
        fill: false
      });
    }
  
    addBollingerBands() {
      const data = this.barChartData[0].data as number[];
      const { middleBand, upperBand, lowerBand } = this.calculateBollingerBands(data, 3, 2); // 3-period and 2-standard deviation Bollinger Bands
      this.barChartData.push({
        data: middleBand,
        label: 'Middle Band',
        type: 'line',
        borderColor: 'green',
        fill: false
      });
      this.barChartData.push({
        data: upperBand,
        label: 'Upper Band',
        type: 'line',
        borderColor: 'purple',
        fill: false
      });
      this.barChartData.push({
        data: lowerBand,
        label: 'Lower Band',
        type: 'line',
        borderColor: 'orange',
        fill: false
      });
    }
  
    addMACD() {
      const data = this.barChartData[0].data as number[];
      const { macd, signal, histogram } = this.calculateMACD(data, 12, 26, 9); // MACD with standard 12, 26, 9 periods
      this.barChartData.push({
        data: macd,
        label: 'MACD',
        type: 'line',
        borderColor: 'brown',
        fill: false
      });
      this.barChartData.push({
        data: signal,
        label: 'Signal Line',
        type: 'line',
        borderColor: 'pink',
        fill: false
      });
      this.barChartData.push({
        data: histogram,
        label: 'Histogram',
        type: 'bar',
        backgroundColor: 'grey'
      });
    }
  
    addRSI() {
      const data = this.barChartData[0].data as number[];
      const rsi = this.calculateRSI(data, 14); // 14-period RSI
      this.barChartData.push({
        data: rsi,
        label: 'RSI',
        type: 'line',
        borderColor: 'yellow',
        fill: false
      });
    }
  
    addStochasticOscillator() {
      const data = this.barChartData[0].data as number[];
      const { k, d } = this.calculateStochasticOscillator(data, 14, 3); // 14-period %K and 3-period %D
      this.barChartData.push({
        data: k,
        label: '%K',
        type: 'line',
        borderColor: 'cyan',
        fill: false
      });
      this.barChartData.push({
        data: d,
        label: '%D',
        type: 'line',
        borderColor: 'magenta',
        fill: false
      });
    }
  
    addADX() {
      const data = this.barChartData[0].data as number[];
      const adx = this.calculateADX(data, 14); // 14-period ADX
      this.barChartData.push({
        data: adx,
        label: 'ADX',
        type: 'line',
        borderColor: 'black',
        fill: false
      });
    }
  
    addCCI() {
      const data = this.barChartData[0].data as number[];
      const cci = this.calculateCCI(data, 20); // 20-period CCI
      this.barChartData.push({
        data: cci,
        label: 'CCI',
        type: 'line',
        borderColor: 'teal',
        fill: false
      });
    }
  
    addATR() {
      const data = this.barChartData[0].data as number[];
      const atr = this.calculateATR(data, 14); // 14-period ATR
      this.barChartData.push({
        data: atr,
        label: 'ATR',
        type: 'line',
        borderColor: 'lime',
        fill: false
      });
    }
  
    addEnvelope() {
      const data = this.barChartData[0].data as number[];
      const { upperEnvelope, lowerEnvelope } = this.calculateEnvelope(data, 0.05); // 5% Envelope
      this.barChartData.push({
        data: upperEnvelope,
        label: 'Upper Envelope',
        type: 'line',
        borderColor: 'maroon',
        fill: false
      });
      this.barChartData.push({
        data: lowerEnvelope,
        label: 'Lower Envelope',
        type: 'line',
        borderColor: 'navy',
        fill: false
      });
    }
  
    calculateMovingAverage(data: number[], period: number): number[] {
      let movingAverage = [];
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          movingAverage.push(null);
        } else {
          const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
          movingAverage.push(sum / period);
        }
      }
      return movingAverage;
    }
  
    calculateExponentialMovingAverage(data: number[], period: number): number[] {
      let ema = [];
      let k = 2 / (period + 1);
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          ema.push(data[0]);
        } else {
          ema.push(data[i] * k + ema[i - 1] * (1 - k));
        }
      }
      return ema;
    }
  
    calculateBollingerBands(data: number[], period: number, stdDev: number) {
      let middleBand = this.calculateMovingAverage(data, period);
      let upperBand = [];
      let lowerBand = [];
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          upperBand.push(null);
          lowerBand.push(null);
        } else {
          const slice = data.slice(i - period + 1, i + 1);
          const mean = middleBand[i];
          const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
          const standardDeviation = Math.sqrt(variance);
          upperBand.push(mean + stdDev * standardDeviation);
          lowerBand.push(mean - stdDev * standardDeviation);
        }
      }
      return { middleBand, upperBand, lowerBand };
    }
  
    calculateMACD(data: number[], shortPeriod: number, longPeriod: number, signalPeriod: number) {
      const shortEma = this.calculateExponentialMovingAverage(data, shortPeriod);
      const longEma = this.calculateExponentialMovingAverage(data, longPeriod);
      const macd = shortEma.map((val, index) => val - longEma[index]);
      const signal = this.calculateExponentialMovingAverage(macd, signalPeriod);
      const histogram = macd.map((val, index) => val - signal[index]);
      return { macd, signal, histogram };
    }
  
    calculateRSI(data: number[], period: number): number[] {
      let rsi = [];
      for (let i = 0; i < data.length; i++) {
        if (i < period) {
          rsi.push(null);
        } else {
          const gains = [];
          const losses = [];
          for (let j = i - period + 1; j <= i; j++) {
            const change = data[j] - data[j - 1];
            if (change > 0) {
              gains.push(change);
            } else {
              losses.push(Math.abs(change));
            }
          }
          const avgGain = gains.reduce((a, b) => a + b, 0) / period;
          const avgLoss = losses.reduce((a, b) => a + b, 0) / period;
          const rs = avgGain / avgLoss;
          rsi.push(100 - (100 / (1 + rs)));
        }
      }
      return rsi;
    }
  
    calculateStochasticOscillator(data: number[], kPeriod: number, dPeriod: number) {
      let k = [];
      for (let i = 0; i < data.length; i++) {
        if (i < kPeriod - 1) {
          k.push(null);
        } else {
          const high = Math.max(...data.slice(i - kPeriod + 1, i + 1));
          const low = Math.min(...data.slice(i - kPeriod + 1, i + 1));
          k.push(((data[i] - low) / (high - low)) * 100);
        }
      }
      const d = this.calculateMovingAverage(k.filter(val => val !== null), dPeriod);
      return { k, d };
    }
  
    calculateADX(data: number[], period: number): number[] {
      let adx = [];
      let tr = [];
      let plusDM = [];
      let minusDM = [];
      for (let i = 1; i < data.length; i++) {
        const highLow = Math.abs(data[i] - data[i - 1]);
        tr.push(highLow);
        plusDM.push(data[i] > data[i - 1] ? highLow : 0);
        minusDM.push(data[i] < data[i - 1] ? highLow : 0);
      }
      const atr = this.calculateMovingAverage(tr, period);
      const plusDI = plusDM.map((dm, index) => (dm / atr[index]) * 100);
      const minusDI = minusDM.map((dm, index) => (dm / atr[index]) * 100);
      for (let i = 0; i < plusDI.length; i++) {
        if (i < period - 1) {
          adx.push(null);
        } else {
          const dx = Math.abs(plusDI[i] - minusDI[i]) / (plusDI[i] + minusDI[i]) * 100;
          adx.push(dx);
        }
      }
      return this.calculateMovingAverage(adx.filter(val => val !== null), period);
    }
  
    calculateCCI(data: number[], period: number): number[] {
      let cci = [];
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          cci.push(null);
        } else {
          const slice = data.slice(i - period + 1, i + 1);
          const mean = slice.reduce((a, b) => a + b, 0) / period;
          const meanDeviation = slice.reduce((sum, val) => sum + Math.abs(val - mean), 0) / period;
          cci.push((data[i] - mean) / (0.015 * meanDeviation));
        }
      }
      return cci;
    }
  
    calculateATR(data: number[], period: number): number[] {
      let tr = [];
      for (let i = 1; i < data.length; i++) {
        tr.push(Math.abs(data[i] - data[i - 1]));
      }
      return this.calculateMovingAverage(tr, period);
    }
  
    calculateEnvelope(data: number[], percentage: number) {
      const middleBand = this.calculateMovingAverage(data, 20); // 20-period moving average for the middle band
      const upperEnvelope = middleBand.map(val => val * (1 + percentage));
      const lowerEnvelope = middleBand.map(val => val * (1 - percentage));
      return { upperEnvelope, lowerEnvelope };
    }
}
