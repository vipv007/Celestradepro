import { Component, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js-dist';

@Component({
  selector: 'app-otp',
  templateUrl: 'otp.page.html',
  styleUrls: ['otp.page.scss']
})
export class OtpPage {

  constructor() { }

  // Function to generate the plot
  generatePlot() {
    const S = Array.from(Array(101).keys()).map(x => x + 50); // Stock price range
    const K = 100; // Strike price
    const premium = 5; // Option premium

    const long_payoff = S.map(price => Math.max(K - price, 0) - premium);
    const short_payoff = S.map(price => -Math.max(K - price, 0) + premium);

    const data = [
      {
        x: S,
        y: long_payoff,
        type: 'scatter',
        mode: 'lines',
        name: 'Long Put Payoff',
        line: {
          color: 'lightgreen' // Light green for profit side of long put
        }
      },
      {
        x: S,
        y: short_payoff,
        type: 'scatter',
        mode: 'lines',
        name: 'Short Put Payoff',
        line: {
          color: 'lightpink' // Light pink for loss side of short put
        }
      }
    ];

    const layout = {
      title: 'Long vs Short Put Option Payoff',
      xaxis: {
        title: 'Stock Price ($)'
      },
      yaxis: {
        title: 'Profit/Loss ($)'
      },
      shapes: [
        {
          type: 'line',
          x0: K,
          y0: Math.min(...long_payoff, ...short_payoff),
          x1: K,
          y1: Math.max(...long_payoff, ...short_payoff),
          line: {
            color: 'red',
            width: 1,
            dash: 'dot'
          }
        }
      ]
    };

    Plotly.newPlot('plot', data, layout);
  }

  ngOnInit() {
    this.generatePlot();
  }
}
