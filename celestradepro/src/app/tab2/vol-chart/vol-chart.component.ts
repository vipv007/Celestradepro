import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-vol-chart',
  templateUrl: './vol-chart.component.html',
  styleUrls: ['./vol-chart.component.scss'],
})
export class VolChartComponent implements OnInit {
  underlyingPrices: number[] = [];
  K_call: number = 100;
  K_put: number = 100;
  price_call: number = 10;
  price_put: number = 5;
  chart: any;

  constructor() {}

  ngOnInit() {
    this.underlyingPrices = Array.from({ length: 200 }, (_, i) => i);
    this.createChart();
  }

  calculatePayoff(S: number[], K: number, optionType: string, price: number): number[] {
    if (optionType === 'call') {
      return S.map(s => Math.max(s - K, 0) - price);
    } else if (optionType === 'put') {
      return S.map(s => Math.max(K - s, 0) - price);
    } else {
      throw new Error("optionType must be 'call' or 'put'");
    }
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const payoffCall = this.calculatePayoff(this.underlyingPrices, this.K_call, 'call', this.price_call);
    const payoffPut = this.calculatePayoff(this.underlyingPrices, this.K_put, 'put', this.price_put);
    const totalPayoff = payoffCall.map((payoff, index) => payoff + payoffPut[index]);

    const ctx = (document.getElementById('payoffChart') as HTMLCanvasElement).getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.underlyingPrices,
        datasets: [
          {
            label: 'Call Option Payoff',
            data: payoffCall,
            borderColor: 'blue',
            borderDash: [5, 5],
            fill: false,
          },
          {
            label: 'Put Option Payoff',
            data: payoffPut,
            borderColor: 'red',
            borderDash: [5, 5],
            fill: false,
          },
          {
            label: 'Total Payoff',
            data: totalPayoff,
            borderColor: 'black',
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Underlying Asset Price',
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Payoff',
            },
          }],
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }

  onSubmit(form: any) {
    this.K_call = form.value.K_call;
    this.K_put = form.value.K_put;
    this.price_call = form.value.price_call;
    this.price_put = form.value.price_put;
    this.createChart();
  }
}
