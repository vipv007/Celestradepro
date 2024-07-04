import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StockService } from 'src/app/services/stock.service';
import { PortfolioService } from '../../services/portfolio.service';
import { MarketdepthService } from 'src/app/services/marketdepth.service';

@Component({
  selector: 'app-widgetchart',
  templateUrl: './widgetchart.component.html',
  styleUrls: ['./widgetchart.component.scss'],
})
export class WidgetchartComponent implements OnInit, AfterViewInit {
updateChart() {
throw new Error('Method not implemented.');
}
  stocks: any[] = [];
  stockData: any = {}; // Object to hold data for each stock symbol
  selectedSymbol: string | null = null; // Variable to hold the currently selected symbol
  selectedTheme: string = 'light'; 
  marketDepthData: any[];
  selectedDateTime: any;
  symbol: any;
  quantity: any;
  price: any;
  low: any;
  high: any;
  triggerprice: any;
  target: any;
  stoploss: any;
  trailingstoploss: any;
  selectedOrderType: any;
  StoplossValue: string;
  TargetsValue: string;
  showBox: boolean = false;
  showButton: boolean = false;
  

  constructor(
    private stockService: StockService,
    private router: Router,
    private route: ActivatedRoute,
    private portfolioService: PortfolioService, 
    private marketdepthService: MarketdepthService
  ) {}

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      console.log('Received symbol:', params.symbol);
      if (params.symbol) {
        this.selectedSymbol = params.symbol;
      }
    });
  }

  ngOnInit() {
    this.fetchStocks();
    this.fetchMarketDepthData();
  }

  fetchStocks() {
    this.stockService.getAllStocks().subscribe((response: any) => {
      this.stocks = response;
      this.stocks.forEach(stock => {
        this.stockData[stock.symbol] = stock.stock.map(dataPoint => ({
          date: new Date(dataPoint.Date),
          open: dataPoint.Open,
          high: dataPoint.High,
          low: dataPoint.Low,
          close: dataPoint.Close,
          volume: dataPoint.Volume
        }));
      });
      console.log('Processed stock data:', this.stockData);
    });
  }

  onStockSelect(stockSymbol: string) {
    this.selectedSymbol = stockSymbol; // Update the selected symbol based on list item click
  }

  onThemeToggle(event: any) {
    this.selectedTheme = event.target.checked ? 'dark' : 'light'; // Toggle theme based on switch
  }

  onSubmit(orderType: string): void {
    const dateTimeString = this.selectedDateTime ? this.selectedDateTime.toString().slice(0, 19).replace('T', ' ') : '';

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
      (response) => {
        console.log('Portfolio created successfully:', response);
        this.fetchPortfolio(); // Fetch portfolio after creating a new portfolio entry
      },
      (error) => {
        console.error('Error occurred while creating portfolio:', error);
      }
    );
  }

  fetchPortfolio() {
    // Method to fetch portfolio details, if required
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

  getTotalOrders(marketDepth: any[], side: string): number {
    return marketDepth.reduce((total, item) => total + (side === 'buy' ? item.buy_quantity : 0), 0);
  }

  getTotalOrder(marketDepth: any[], side: string): number {
    return marketDepth.reduce((total, item) => total + (side === 'sell' ? item.sell_quantity : 0), 0);
  }
}
