
import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HC_heatmap = require('highcharts/modules/heatmap');
HC_heatmap(Highcharts);

@Component({
  selector: 'app-chart',
  templateUrl: 'chart.page.html',
  styleUrls: ['chart.page.scss'],
})
export class ChartPage {
  public Highcharts = Highcharts;

  public chartOptions: Highcharts.Options = {
    colorAxis: {
      min: 1,
      minColor: '#0cf01b',
      maxColor: '#f00c1b',
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 25,
      symbolHeight: 350,
    },
    series: [{
      name: 'EURUSD',
      type: 'heatmap',
      borderWidth: 0,
      data: [
        [0, 0, 1.23], [0, 1, 1.42], [0, 2, 109.45], [0, 3, 0.75], [0, 4, 0.93], [0, 5, 1.2],
        [1, 0, 1.24], [1, 1, 1.43], [1, 2, 109.55], [1, 3, 0.76], [1, 4, 209.94], [1, 5, 1.21],
        [2, 0, 1.22], [2, 1, 1.41], [2, 2, 109.35], [2, 3, 0.74], [2, 4, 0.92], [2, 5, 1.19],
        [3, 0, 1.25], [3, 1, 1.44], [3, 2, 109.65], [3, 3, 0.77], [3, 4, 200.95], [3, 5, 1.22],
        [4, 0, 1.21], [4, 1, 1.40], [4, 2, 109.25], [4, 3, 0.73], [4, 4, 0.91], [4, 5, 1.18],
        [5, 0, 1.26], [5, 1, 1.45], [5, 2, 109.75], [5, 3, 0.78], [5, 4, 300.96], [5, 5, 1.23],
      ],
      dataLabels: {
        enabled: true,
        color: '#000000',
      },
    }],
  };

  // No need to re-initialize HC_heatmap in the constructor
  constructor() {}
}
