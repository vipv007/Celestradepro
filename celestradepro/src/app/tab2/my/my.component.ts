import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss'],
})
export class MyComponent  {

  underlyingPrice: number = 0;
  strikePrice: number = 0;
  optionPrice: number = 0;
  quantity: number = 0;
  result: number = 0;
  chartData: any;

  // Function to calculate payoff and generate chart data
  calculatePayoff() {
    // Perform calculations based on option strategy (e.g., put, call, etc.)
    // For simplicity, let's assume a simple call option strategy
    this.result = Math.max(this.underlyingPrice - this.strikePrice, 0) * this.quantity - this.optionPrice;

    // Generate chart data
    this.chartData = {
      labels: ['StrikePrice', 'Payoff'],
      datasets: [
        {
          label: 'Payoff Diagram',
          data: [this.strikePrice, this.result],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  }
}

