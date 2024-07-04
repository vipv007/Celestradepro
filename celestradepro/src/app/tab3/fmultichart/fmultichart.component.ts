import { Component, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';

import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ForexService } from 'src/app/services/forex.service';
@Component({
  selector: 'app-fmultichart',
  templateUrl: './fmultichart.component.html',
  styleUrls: ['./fmultichart.component.scss'],
})
export class FmultichartComponent {
  commoditys: any[];

  constructor(
    private forexService: ForexService,
    private router: Router,
    private navCtrl: NavController,
  ) {}

  ngAfterViewInit() {
    this.fetchStocks();
  }

  fetchStocks() {
    this.forexService. getAllForexs().subscribe((response: any) => {
      this.commoditys = response;
      this.commoditys.forEach(com => {
        setTimeout(() => { // Delay rendering
          this.renderChart(com.symbol, com.values);
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


}
