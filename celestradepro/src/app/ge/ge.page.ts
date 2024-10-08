import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { FrxindexService } from '../services/frxindex.service';

@Component({
  selector: 'app-ge',
  templateUrl: './ge.page.html',
  styleUrls: ['./ge.page.scss'],
})
export class GEPage implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: '#FFFFFF',
          fontSize: 14,
        }
      }],
      yAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: '#FFFFFF',
          fontSize: 14,
        }
      }]
    },
    legend: {
      labels: {
        fontColor: '#FFFFFF',
        fontSize: 14
      }
    }
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = false;
  public barChartData = [
    { data: [], label: '' }
  ];

  public barChartColors: Color[] = [
    {
      backgroundColor: []
    }
  ];

  public selectedTimeframe = '1 Day';
  private technicals: any = {};

  constructor(private frxindexService: FrxindexService) {}

  ngOnInit(): void {
    this.fetchTechnical(); // Fetch data when the component initializes
  }

  fetchTechnical(): void {
    this.frxindexService.getFrxindexs().subscribe((response: any) => {
      console.log('API Response:', response); // Log the response to check the structure

      if (response && response.length > 0) {
        // Access the first object in the array
        const data = response[0];

        this.technicals = data;

        // Extract sectors from one of the time periods, e.g., `1_week`
        this.barChartLabels = Object.keys(data['1_week']); // Assuming all periods have the same sectors

        // Initialize the chart data
        this.updateChartData(data);
      } else {
        console.error('Data not found in the response.');
      }
    });
  }

  updateChart(timeframe: string): void {
    this.selectedTimeframe = timeframe;
    this.updateChartData(this.technicals); // Pass the fetched technical data
  }

  updateChartData(performanceData: any): void {
    // Mapping MongoDB fields to the corresponding timeframes
    const timeframeMapping: any = {
      '1 Day': 'days',
      '1 Week': '1_week',
      '1 Month': '1_month',
      '3 Months': '3_months'
    };

    const timeframeKey = timeframeMapping[this.selectedTimeframe];
    const timeframeData = performanceData[timeframeKey];

    if (timeframeData) {
      const sectorValues = Object.values(timeframeData); // Extract the performance values

      this.barChartData = [
        { data: sectorValues, label: this.selectedTimeframe + ' Performance' }
      ];

      // Update colors based on positive/negative values
      this.barChartColors = [
        {
          backgroundColor: sectorValues.map((value: number) => 
            value >= 0 ? '#4CAF50' : '#F44336'
          )
        }
      ];
    } else {
      console.error(`No data available for the selected timeframe: ${this.selectedTimeframe}`);
      // Handle the case where data is missing or incorrect
    }
  }
}
