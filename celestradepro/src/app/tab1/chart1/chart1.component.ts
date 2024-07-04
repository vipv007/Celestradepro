import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

interface StockData {
  Symbol: string;
  Data: {
    AnalystTargetPrice: number;
    AnalystRatingStrongBuy: number;
    AnalystRatingBuy: number;
    AnalystRatingHold: number;
    AnalystRatingSell: number;
    AnalystRatingStrongSell: number;
  };
}

@Component({
  selector: 'app-chart1',
  templateUrl: './chart1.component.html',
  styleUrls: ['./chart1.component.scss'],
})
export class Chart1Component implements OnInit {



  @ViewChild('myChart') myChart: ElementRef;

  stockData: StockData[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchStockData();
  }

  fetchStockData() {
    this.http.get<StockData[]>('http://localhost:3000/api/analystic').subscribe(
      data => {
        this.stockData = data;
        this.renderChart();
      },
      error => {
        console.error('Error fetching stock data:', error);
      }
    );
  }

  renderChart() {
    const labels = this.stockData.map(stock => stock.Symbol);
    const targetPriceValues = this.stockData.map(stock => stock.Data.AnalystTargetPrice);
    const strongBuyValues = this.stockData.map(stock => stock.Data.AnalystRatingStrongBuy);
    const buyValues = this.stockData.map(stock => stock.Data.AnalystRatingBuy);
    const holdValues = this.stockData.map(stock => stock.Data.AnalystRatingHold);
    const sellValues = this.stockData.map(stock => stock.Data.AnalystRatingSell);
    const strongSellValues = this.stockData.map(stock => stock.Data.AnalystRatingStrongSell);

    const ctx = this.myChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Analyst Target Price',
            data: targetPriceValues,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          },
          {
            label: 'Strong Buy',
            data: strongBuyValues,
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
          },
          {
            label: 'Buy',
            data: buyValues,
            backgroundColor: 'rgba(255, 206, 86, 0.6)'
          },
          {
            label: 'Hold',
            data: holdValues,
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          },
          {
            label: 'Sell',
            data: sellValues,
            backgroundColor: 'rgba(153, 102, 255, 0.6)'
          },
          {
            label: 'Strong Sell',
            data: strongSellValues,
            backgroundColor: 'rgba(255, 159, 64, 0.6)'
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
  
}
