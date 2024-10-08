import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { MarketdepthService } from 'src/app/services/marketdepth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit {
  TargetsValue: string;
  StoplossValue: string;
  stocks: any;
  symbol: string;
  straightLineValue: any;
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
  marketDepthData: any[];
  displayMarketDepth = false;
  mk: any;
  chartData: any[] = [];
  isDarkMode = false; // Initial state



  constructor(private stockService: StockService, private router: Router,
    private portfolioService: PortfolioService, private route: ActivatedRoute,
    private marketdepthService: MarketdepthService, private alertController: AlertController) { }
  
  
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


  openLoginForm() {
    this.modalOpen = true;
  }

  closeLoginForm() {
    this.modalOpen = false;
  }

  fetchPortfolio() {
    this.portfolioService.getAllPortfolio().subscribe((response: any) => {
      this.portfolio = response;
      console.log('Fetched portfolio:', this.portfolio);
    }, (error) => {
      console.error('Error occurred while fetching portfolio:', error);
    });
  }

  onSubmit(orderType: string): void {
    const dateTimeString = this.selectedDateTime.toString().slice(0, 19).replace('T', ' ');

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

    this.portfolioService.createPortfolio(portfolioData)
      .subscribe(
        (response) => {
          console.log('Portfolio created successfully:', response);
          this.fetchPortfolio(); // Fetch portfolio after creating a new portfolio entry
          alert("submitted.");
        },
        (error) => {
          console.error('Error occurred while creating portfolio:', error);
        }
      );
    this.updateChart();
  }

  validateForm(): boolean {
    return this.quantity !== undefined && this.quantity > 0 &&
           this.price !== undefined && this.price > 0 &&
           this.triggerprice !== undefined && this.triggerprice > 0 &&
           this.target !== undefined && this.target > 0 &&
           this.stoploss !== undefined && this.stoploss > 0;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
     this.symbol = params.symbol || 'AAPL';
      this.mk = params.symbol;
      console.log('Received:', this.symbol);
      this.loadChartData();
      this.fetchPortfolio();// Fetch portfolio when component initializes
      this.fetchMarketDepthData();
    });
  }

  loadChartData() {
    this.stockService.getAllStocks().subscribe((response) => {
      this.stocks = response;
      console.log(this.stocks);
      if (this.symbol) {
        this.updateChart();
      }
    });
  }

  loadSymbolData(selectedSymbol: string) {
  this.symbol = selectedSymbol; // Update the symbol
  this.mk = this.symbol; // Update the market symbol if necessary
  this.loadChartData(); // Load chart data for the new symbol
  this.fetchPortfolio(); // Fetch portfolio data
  this.fetchMarketDepthData(); // Fetch market depth data
  console.log(`Loaded data for symbol: ${this.symbol}`);
}


  showPrice(price: number) {
    this.price = price;
  }
  showlow(low: number) {
    this.low = low;
  }
  showhigh(high: number) {
    this.high = high;
  }
  showPrices(price: string) {
    this.StoplossValue = price;
  }
  showPricess(price: string) {
    this.TargetsValue = price;
  }

  onSelectionChange(stock: any) {
    if (stock.selected) {
      this.symbol = stock.symbol;
      // Deselect other stocks
      this.stocks.forEach(s => {
        if (s !== stock) {
          s.selected = false;
        }
      });
      this.updateChart();
    }
  }

  updateChart() {
    const selectedStock = this.stocks.find(stock => stock.symbol === this.symbol);
    this.chartData = selectedStock.stock.map(dataPoint => ({
      date: new Date(dataPoint.Date),
      open: dataPoint.Open,
      high: dataPoint.High,
      low: dataPoint.Low,
      close: dataPoint.Close
    }));

    // Adding lines for price, target, and stoploss
    if (this.price !== undefined && !isNaN(this.price)) {
      this.chartData.push({ date: new Date(), open: this.price, high: this.price, low: this.price, close: this.price });
    }

    if (this.target !== undefined && !isNaN(this.target)) {
      this.chartData.push({ date: new Date(), open: this.target, high: this.target, low: this.target, close: this.target });
    }

    if (this.stoploss !== undefined && !isNaN(this.stoploss)) {
      this.chartData.push({ date: new Date(), open: this.stoploss, high: this.stoploss, low: this.stoploss, close: this.stoploss });
    }
  }

  fetchMarketDepthData() {
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

   // Function to toggle dark mode
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

}
