import { Component, OnInit } from '@angular/core';
import { ForexService } from '../services/forex.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';
import { MarketdepthService } from 'src/app/services/marketdepth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forexch',
  templateUrl: './forexch.component.html',
  styleUrls: ['./forexch.component.scss'],
})
export class ForexchComponent implements OnInit {

  priceValue: string;
  forexs: any;
  symbol: string;
  portfolio: any[];
  currentIndex = 0;
  selectedSegment: any;
  quantity: number;
  price: number;
  triggerprice: number;
  target: number;
  stoploss: number;
  trailingstoploss: number;
  selectedDateTime: Date = new Date();
  selectedOrderType = '';
  modalOpen: boolean;
  low: number;
  high: number;
  showBox = false;
  TargetsValue: string;
  StoplossValue: string;
  mk: any;
  marketDepthvalues: any[];
  forexPrices: any;
  chartvalues: any[] = [];
  linesvalues: any[] = [];
  showButton: any;
  folio: any;
  marketDepthData: any;
  chartData: any[];
  selectedTheme = 'light';
   isDarkMode = false; // Initial state


  constructor(
    private forexService: ForexService,
    private route: ActivatedRoute,
    private router: Router,
    private portfolioService: PortfolioService,
    private marketdepthService: MarketdepthService
  ) { }

  openLoginForm() {
    this.modalOpen = true;
  }

  closeLoginForm() {
    this.modalOpen = false;
  }

  showPrice(price: number) {
    this.price = price;
    this.addLinevalues();
  }

  showlow(low: number) {
    this.low = low;
  }

  showhigh(high: number) {
    this.high = high;
  }

  showPrices(price: string) {
    this.StoplossValue = price;
    this.addLinevalues();
  }

  showPricess(price: string) {
    this.TargetsValue = price;
    this.addLinevalues();
  }

  onSubmit(orderType: string): void {
    const dateTimeString = this.selectedDateTime.toString().slice(0, 19).replace('T', ' ');

    const portfoliovalues = {
      stock: this.symbol,
      type: 'forex',
      order: orderType,
      quantity: this.quantity,
      price: this.price,
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

    this.portfolioService.createPortfolio(portfoliovalues)
      .subscribe(
        (response) => {
          console.log('Portfolio created successfully:', response);
        },
        (error) => {
          console.error('Error occurred while creating portfolio:', error);
        }
      );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.symbol = params.symbol || 'EURUSD';
      console.log('Query Params Symbol:', this.symbol);
      this.loadChartvalues();
      this.fetchMarketDepthvalues();
    });

    this.selectedTheme = localStorage.getItem('selectedTheme') || 'light';  // Load saved theme
  }

  onThemeToggle(event: any) {
    this.selectedTheme = event.target.checked ? 'dark' : 'light';
    localStorage.setItem('selectedTheme', this.selectedTheme);  // Save theme preference
  }


  loadChartvalues() {
    this.forexService.getAllForexs().subscribe((response) => {
      this.forexs = response;
      console.log(this.forexs);
      if (this.symbol) {
        this.updateChart();
      }
    });
  }

  loadSymbolData(selectedSymbol: string) {
  this.symbol = selectedSymbol; // Update the symbol
  this.mk = this.symbol; // Update the market symbol if necessary
  this.loadChartvalues(); // Load chart data for the new symbol
 // this.fetchPortfolio(); // Fetch portfolio data
  this.fetchMarketDepthvalues(); // Fetch market depth data
  console.log(`Loaded data for symbol: ${this.symbol}`);
}


  onSelectionChange(values: any) {
    if (values.selected) {
      this.symbol = values.symbol;
      // Deselect other stocks
      this.forexs.forEach(s => {
        if (s !== values) {
          s.selected = false;
        }
      });
      this.updateChart();
    }
  }

  updateChart() {
    const selectedforex = this.forexs.find(values => values.symbol === this.symbol);
    this.chartData = selectedforex.values.map(valuesPoint => ({
      date: new Date(valuesPoint.Date),
      open: valuesPoint.Open,
      high: valuesPoint.High,
      low: valuesPoint.Low,
      close: valuesPoint.Close
    }));

    this.addLinevalues();
  }

  addLinevalues() {
    this.linesvalues = [];

    if (this.price !== undefined && !isNaN(this.price)) {
      this.linesvalues.push({
        value: this.price,
        label: 'Straight Line',
        thickness: 2,
        color: 'blue'
      });
    }

    if (this.target !== undefined && !isNaN(this.target)) {
      this.linesvalues.push({
        value: this.target,
        label: 'Target Line',
        thickness: 2,
        color: 'red'
      });
    }

    if (this.stoploss !== undefined && !isNaN(this.stoploss)) {
      this.linesvalues.push({
        value: this.stoploss,
        label: 'Stoploss Line',
        thickness: 2,
        color: 'green'
      });
    }
  }

  fetchMarketDepthvalues() {
     this.marketdepthService.getAllMarketDepth().subscribe(
      (data: any[]) => {
        this.marketDepthData = data.filter((depth: any) => depth.symbol === this.symbol);
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
  
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode; 
  }

}
