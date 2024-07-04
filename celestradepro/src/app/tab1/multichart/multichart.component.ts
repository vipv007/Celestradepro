import { Component, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';

import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-multichart',
  templateUrl: './multichart.component.html',
  styleUrls: ['./multichart.component.scss'],
})
export class MultichartComponent  {
  stocks: any[];
  selectTabs = 'missed';
  clickedStock = '';

  constructor(
    private stockService: StockService,
    private router: Router,
    private navCtrl: NavController,
  ) {}

  ngAfterViewInit() {
    this.fetchStocks();
  }

  fetchStocks() {
    this.stockService.getAllStocks().subscribe((response: any) => {
      this.stocks = response;
      this.stocks.forEach(stock => {
        setTimeout(() => { // Delay rendering
          this.renderChart(stock.symbol, stock.stock);
        }, 100); // Adjust the delay time if needed
      });
    });
  }

  renderChart(symbol: string, data: any[]) {
    Highcharts.stockChart('chartContainer_' + symbol, {
      rangeSelector: {
        selected: 1,
      },
      title: {
        text: symbol,
      },
      yAxis: {
        title: {
          text: 'Price',
        },
      },
      series: [{
        type: 'candlestick',
        name: symbol,
        data: data.map(dataPoint => [
          new Date(dataPoint.Date).getTime(),
          dataPoint.Open,
          dataPoint.High,
          dataPoint.Low,
          dataPoint.Close,
        ]),
        color: 'green',
        upColor: 'red',
      }],
    });
  }

   handleChartClick(symbol: string) {
     this.clickedStock = symbol;
    console.log('Clicked Stock:', this.clickedStock);
    this.selectTabs = 'missed';
    this.router.navigate(['/tabs/tab1/analysis'], { queryParams: { symbol } });
  }

  
}


