import { Component, OnInit } from '@angular/core';
import { StockDataService } from '../services/stock-data.service';
import { createChart, Time } from 'lightweight-charts';

@Component({
  selector: 'app-cret',
  templateUrl: './cret.page.html',
  styleUrls: ['./cret.page.scss']
})
export class CretPage implements OnInit {
  constructor(private stockDataService: StockDataService) {}

  async ngOnInit() {
    const data = await this.stockDataService.getStockData();
    if (data) {
      const { dates, closePrices } = data;

      // Create the chart
      const chart = createChart(document.getElementById('chart')!, {
        width: 800,
        height: 400
      });

      // Create line series for stock prices
      const lineSeries = chart.addLineSeries();
      lineSeries.setData(dates.map((date, i) => ({
        time: this.formatTime(date), // format time correctly
        value: closePrices[i]
      })));

      // Calculate and set SMA data
      const sma = this.stockDataService.calculateSMA(closePrices, 20);
      const smaSeries = chart.addLineSeries({ color: 'blue' });
      smaSeries.setData(sma.map((value, i) => ({
        time: this.formatTime(dates[i + 19]), // Adjust for SMA period and format time correctly
        value
      })));

      // Add watermark
      chart.applyOptions({
        watermark: {
          color: 'rgba(0, 0, 0, 0.4)',
          visible: true,
          text: 'MSFT',
          fontSize: 48,
          horzAlign: 'center',
          vertAlign: 'center',
        },
      });
    }
  }

  private formatTime(date: Date): Time {
    // Convert the date to 'yyyy-MM-dd' string format
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
