import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { PortfolioService } from '../services/portfolio.service';

@Component({
  selector: 'app-plots',
  templateUrl: './plots.page.html',
  styleUrls: ['./plots.page.scss']
})
export class PlotsPage implements OnInit {
  
  portfolioData: any[];

  constructor(private portfolioService: PortfolioService) { }

  fetchPortfolioData() {
    this.portfolioService.getAllPortfolio().subscribe((response: any[]) => {
      this.portfolioData = response;
      this.updateChart();
    });
  }

  ngOnInit(): void {
    this.fetchPortfolioData();
  }

  updateChart() {
    if (!this.portfolioData || this.portfolioData.length === 0) {
      console.error("Portfolio data is empty.");
      return;
    }

    const typeSymbolMap = new Map<string, Map<string, number>>();

    this.portfolioData.forEach(item => {
      const type = item.type;
      const symbol = item.stock;
      
      if (!typeSymbolMap.has(type)) {
        typeSymbolMap.set(type, new Map<string, number>());
      }
      
      const symbolMap = typeSymbolMap.get(type);
      if (!symbolMap.has(symbol)) {
        symbolMap.set(symbol, 0);
      }
      symbolMap.set(symbol, symbolMap.get(symbol) + 1);
    });

    const seriesData = [];
    
    typeSymbolMap.forEach((symbolMap, type) => {
      const data = [];
      symbolMap.forEach((count, symbol) => {
        data.push({ name: symbol, y: count });
      });

      seriesData.push({
        name: type,
        data: data
      });
    });

    const options: Highcharts.Options = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Symbol Names by Type'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}'
          }
        }
      },
      series: seriesData
    };

    Highcharts.chart('chart-container', options);
  }
}
