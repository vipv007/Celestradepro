import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OptionsChainService } from '../services/optionschain.service';
import { PortfolioService } from '../services/portfolio.service';
import { MarketdepthService } from 'src/app/services/marketdepth.service';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-optionch',
  templateUrl: './optionch.component.html',
  styleUrls: ['./optionch.component.scss'],
})
export class OptionchComponent implements OnInit {
  options: any[] = [];
  selectedSymbol: string = '';
  chart: Highcharts.Chart;
  marketDepthData: any[];
  selectedDateTime: Date = new Date();
  symbol: string = '';
  quantity: number;
  price: number;
  low: number;
  high: number;
  triggerprice: number;
  target: number;
  stoploss: number;
  trailingstoploss: number;
  selectedOrderType: string;
  showBox: boolean;
  showButton: boolean;
optionData: any;

  constructor(
    private optionsChainService: OptionsChainService,
    private portfolioService: PortfolioService, 
    private marketdepthService: MarketdepthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedSymbol = params['symbol'];
      console.log('Selected symbol from query params:', this.selectedSymbol);
      this.loadChartData();
      this.fetchMarketDepthData();
    });
  }

  toggleShowBox() {
    this.showBox = !this.showBox;
  }

  toggleShowButton() {
    this.showButton = !this.showButton;
  }

  loadChartData() {
    this.optionsChainService.getoptions().subscribe(
      (response: any[]) => {
        this.options = response;
        console.log('Options data fetched:', response);
        this.updateChart();
      },
      error => {
        console.error('Error fetching options data', error);
      }
    );
  }

  updateChart(symbolType?: string) {
    if (!this.selectedSymbol) {
      console.error('Selected symbol is not set.');
      return;
    }

    const selectedOptions = this.options.find(option => option.symbol === this.selectedSymbol);
    if (!selectedOptions) {
      console.error(`Options with symbol ${this.selectedSymbol} not found.`);
      return;
    }

    let chartData: Highcharts.SeriesOptionsType[] = [];

    if (symbolType === 'put' || symbolType === 'combined') {
      if (selectedOptions.puts && selectedOptions.puts.length > 0) {
        const putsData = selectedOptions.puts.map(option => ({
          x: new Date(option.lastTradeDate).getTime(),
          y: parseFloat(option.lastPrice)
        }));
        chartData.push({ type: 'column', name: 'Put Options', data: putsData, color: '#CA8787' });
      } else {
        console.warn('No puts data available.');
      }
    }

    if (symbolType === 'call' || symbolType === 'combined') {
      if (selectedOptions.calls && selectedOptions.calls.length > 0) {
        const callsData = selectedOptions.calls.map(option => ({
          x: new Date(option.lastTradeDate).getTime(),
          y: parseFloat(option.lastPrice)
        }));
        chartData.push({ type: 'column', name: 'Call Options', data: callsData, color: '#006769' });
      } else {
        console.warn('No calls data available.');
      }
    }

    const chartOptions: Highcharts.Options = {
      chart: { type: 'column' },
      title: { text: 'Option Prices' },
      xAxis: { type: 'datetime', title: { text: 'Date' } },
      yAxis: { title: { text: 'Price' } },
      series: chartData
    };

    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = Highcharts.stockChart('chart', chartOptions);
  }

  onSubmit(orderType: string): void {
    const dateTimeString = this.selectedDateTime.toISOString().slice(0, 19).replace('T', ' ');

    const portfolioData = {
      stock: this.symbol,
      type: 'stock',
      order: orderType,
      quantity: this.quantity,
      price: this.price,
      low: this.low,
      high: this.high,
      triggerprice: this.triggerprice,
      target: this.target,
      stoploss: this.stoploss,
      trailingstoploss: this.trailingstoploss,
      selectedDateTime: dateTimeString,
      selectedOrderType: this.selectedOrderType,
      totalamount: this.quantity * this.price,
      credit: 1000 + this.price,
      margininitial: this.price * this.quantity,
      marginmaint: 200 + this.target
    };

    this.portfolioService.createPortfolio(portfolioData).subscribe(
      response => {
        console.log('Portfolio created successfully:', response);
      },
      error => {
        console.error('Error occurred while creating portfolio:', error);
      }
    );
  }

  fetchMarketDepthData() {
    this.marketdepthService.getAllMarketDepth().subscribe(
      (data: any[]) => {
        this.marketDepthData = data.filter((depth: any) => depth.symbol === this.selectedSymbol);
      },
      (error) => {
        console.error('Error fetching marketDepthData:', error);
      }
    );
  }

  getTotalOrders(marketDepth: any[], type: 'buy' | 'sell'): number {
    return marketDepth.reduce((total, item) => total + (type === 'buy' ? item.b_order : item.s_order), 0);
  }

  showPrice(price: number) {
    this.price = price;
  }

  showLow(low: number) {
    this.low = low;
  }

  showHigh(high: number) {
    this.high = high;
  }
}
