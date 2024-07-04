import { Component, OnInit } from '@angular/core';
import { OptionsService } from '../../services/options.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-option-io',
  templateUrl: './option-io.component.html',
  styleUrls: ['./option-io.component.scss'],
})
export class OptionIoComponent implements OnInit {

 details: any[];

  constructor(private optionsService: OptionsService) { }

  ngOnInit() {
    this.optionsService.getOptions().subscribe(
      (data: any) => {
        this.details = data;
        this.renderChart();
      },
      error => {
        console.log(error);
      }
    );
  }

  renderChart() {
    const chartData = {
     labels: this.details.map(detail => detail['Strike Price']),
      datasets: [
        {
          label: 'Call Open  Interest',
         data: this.details.map(detail => detail['Call-Open Interest']),
          backgroundColor: '#de2cc9', // Set the background color of "Price" bars to blue
          borderColor: '#4bc0c0'
        },
        {
          label: 'Put Open Interest',
         data: this.details.map(detail => detail['Put-Open Interest']),
          backgroundColor: '#0c6be8', // Set the background color of "Implied Volatility" bars to pink
          borderColor: '#f44336'
        },
        // {
        //   label: 'Open Interest',
        //   data: this.details.map(detail => detail.open_interest),
        //   fill: false,
        //   borderColor: '#565656'
        // }
      ]
    };

    const chartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };

    const chart = new Chart('canvas', {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  }
}