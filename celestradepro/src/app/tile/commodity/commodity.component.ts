import { Component, OnInit } from '@angular/core';
import { CommodityService } from 'src/app/services/commodity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { MarketdepthService } from 'src/app/services/marketdepth.service';
import { HttpErrorResponse } from '@angular/common/http';

interface CommodityData {
  _id: string;
  Commodity: string;
  Symbol: string;
  Data: {
    Date: string;
    Ask: number;
    Bid: number;
    Change: number;
    Open: number;
    High: number;
    Low: number;
    Close: number;
  }[];
}

@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.scss'],
})
export class CommodityComponent implements OnInit {
  isDarkMode: boolean = false; // Initial state

  // Function to toggle dark mode
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }
  
  priceValue: string;
  commoditys: any;
  Symbol: string;
  portfolio: any[] = []; // Initialize portfolio array
  currentIndex = 0;
  selectedSegment: any;
  quantity: number;
  price: number;
  triggerprice: number;
  target: number;
  stoploss: number;
  trailingstoploss: number;
  selectedDateTime: Date = new Date();
  selectedOrderType: string = ''; 
  modalOpen: boolean;
  low: number;
  high: number;
  showBox = false;
  TargetsValue: string;
  StoplossValue: string;
  mk: any;
  marketDepthData: any[];
  commodityPrices: any;
  chartData: any[] = [];
  linesData: any[] = [];

  constructor(
    private commodityService: CommodityService,
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
    this.addLineData();
  }

  showlow(low: number) {
    this.low = low;
  }

  showhigh(high: number) {
    this.high = high;
  }

  showPrices(price: string) {
    this.StoplossValue = price;
    this.addLineData();
  }

  showPricess(price: string) {
    this.TargetsValue = price;
    this.addLineData();
  }

  onSubmit(orderType: string): void {
    const dateTimeString = this.selectedDateTime.toString().slice(0, 19).replace('T', ' ');

    const portfolioData = {
      stock: this.Symbol,
      type: 'commodity',
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

    this.portfolioService.createPortfolio(portfolioData)
      .subscribe(
        (response) => {
          console.log('Portfolio created successfully:', response);
          // If needed, perform any additional actions upon successful portfolio creation
        },
        (error) => {
          console.error('Error occurred while creating portfolio:', error);
        }
      );
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.Symbol = params.Symbol || 'GC=F';
      this.mk = this.Symbol;
      console.log('Received:', this.Symbol);
      this.loadChartData();
      this.fetchMarketDepthData();
      this.fetchCommodityPrices();
    });
  }

  loadSymbolData(selectedSymbol: string) {
  this.Symbol = selectedSymbol; // Update the symbol
  this.mk = this.Symbol; // Update the market symbol if necessary
  this.loadChartData(); // Load chart data for the new symbol
 // this.fetchPortfolio(); // Fetch portfolio data
  this.fetchMarketDepthData(); // Fetch market depth data
  console.log(`Loaded data for symbol: ${this.Symbol}`);
  }
  
  loadChartData() {
    this.commodityService.getCommodities().subscribe((response) => {
      this.commoditys = response;
      console.log(this.commoditys);
      if (this.Symbol) {
        this.updateChart();
      }
    });
  }

  onSelectionChange(Data: any) {
    if (Data.selected) {
      this.Symbol = Data.Symbol;
      // Deselect other stocks
      this.commoditys.forEach(s => {
        if (s !== Data) {
          s.selected = false;
        }
      });
      this.updateChart();
    }
  }

  updateChart() {
    const selectedCommodity = this.commoditys.find(Data => Data.Symbol === this.Symbol);
    this.chartData = selectedCommodity.Data.map(dataPoint => ({
      date: new Date(dataPoint.Date),
      open: dataPoint.Open,
      high: dataPoint.High,
      low: dataPoint.Low,
      close: dataPoint.Close
    }));

    this.addLineData();
  }

  addLineData() {
    this.linesData = [];
    
    if (this.price !== undefined && !isNaN(this.price)) {
      this.linesData.push({
        value: this.price,
        label: 'Price Line',
        thickness: 2,
        color: 'blue'
      });
    }
    
    if (this.target !== undefined && !isNaN(this.target)) {
      this.linesData.push({
        value: this.target,
        label: 'Target Line',
        thickness: 2,
        color: 'red'
      });
    } else {
      this.linesData.push({
        value: null, // Or any default value you prefer
        label: 'Target Line',
        thickness: 2,
        color: 'red'
      });
    }
    
    if (this.stoploss !== undefined && !isNaN(this.stoploss)) {
      this.linesData.push({
        value: this.stoploss,
        label: 'Stoploss Line',
        thickness: 2,
        color: 'green'
      });
    }
    
    // Add drop line logic
    const dropLineThreshold = 25; // Change this value to your desired threshold
    if (this.price !== undefined && this.price < dropLineThreshold) {
      this.linesData.push({
        value: dropLineThreshold,
        label: 'Drop Line',
        thickness: 2,
        color: 'red'
      });
    }
  }
  
  

  fetchMarketDepthData() {
    this.marketdepthService.getAllMarketDepth().subscribe(
      (data: any[]) => {
        this.marketDepthData = data.filter((depth: any) => depth.symbol === this.Symbol);
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

  fetchCommodityPrices() {
    this.commodityService.getCommodityPrices().subscribe(
      (data) => {
        this.commodityPrices = data;
      },
      (error) => {
        console.error('Error fetching commodity prices:', error);
        // Handle error message based on error status or type
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            console.error('Network error occurred. Please check your internet connection.');
          } else {
            console.error('An error occurred while fetching commodity prices. Please try again later.');
          }
        } else {
          console.error('An unexpected error occurred. Please try again later.');
        }
      }
    );
 
  }
}