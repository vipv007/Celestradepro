import { Component } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-db',
  templateUrl: './db.page.html',
  styleUrls: ['./db.page.scss'],
})
export class DbPage {
  showChart = false;
  xPos = 0;
  yPos = 0;

  // Chart.js options
  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Correct structure without generic
  public chartData: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Stock Price',
        data: [65, 59, 80, 81, 56],
        fill: false,
        borderColor: 'blue',
       // Optional for smoothing lines
      },
    ],
  };

  public chartType: ChartType = 'line';

  // Mouse hover events
  onMouseOver(event: MouseEvent) {
    this.showChart = true;
    this.xPos = event.clientX;
    this.yPos = event.clientY;
  }

  onMouseLeave() {
    this.showChart = false;
  }

  onMouseMove(event: MouseEvent) {
    this.xPos = event.clientX + 10;
    this.yPos = event.clientY + 10;
  }
}
