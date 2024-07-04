import { Component, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CommodityService } from 'src/app/services/commodity.service';


@Component({
  selector: 'app-com-chart',
  templateUrl: './com-chart.component.html',
  styleUrls: ['./com-chart.component.scss'],
})
export class ComChartComponent {

 commodities: any[];
  
constructor(
    private commodityService: CommodityService,
    private router: Router,
    private navCtrl: NavController,
  ) {}

  ngAfterViewInit() {
    this.fetchComs();
  }

  fetchComs() {
    this.commodityService. getCommodities().subscribe((response: any) => {
      this.commodities = response;
      console.log(this.commodities);
      this.commodities.forEach(Data => {
        setTimeout(() => { // Delay rendering
          this.renderChart(Data.Symbol, Data.Data);
        }, 100); // Adjust the delay time if needed
      });
    });
  }

  renderChart(Symbol: string, data: any[]) {
    Highcharts.stockChart('chartContainer_' + Symbol, {
      rangeSelector: {
        selected: 1,
      },
      title: {
        text: Symbol,
      },
      yAxis: {
        title: {
          text: 'Price',
        },
      },
      series: [{
        type: 'candlestick',
        name: Symbol,
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

