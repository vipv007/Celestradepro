import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import * as Highcharts from 'highcharts/highstock';
import Chart from 'chart.js';
import { StockService } from '../services/stock.service';
import { PortfolioService } from '../services/portfolio.service';
import { ForexService } from '../services/forex.service';
import { CommodityService } from '../services/commodity.service';
import { OptionsService } from '../services/options.service';
import { MarketdepthService } from '../services/marketdepth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit {
  @ViewChild('segment') segment: IonSegment;

  modalOpen = false;
  email = '';
  password = '';
  forex: any[];
  stocks: any[];
  selectTabs = 'recent';
  barChart: Chart;
  intervalId: any;
  commoditys: any;
  options: any;
  index = 0;
  portfolio: any[];
  currentIndex = 0;
  selectedSegment: any;
  quantity: number;
  price: number;
  triggerprice: number;
  target: number;
  stoploss: number;
  order: string;
  trailingstoploss: number;
  selectedDateTime: Date = new Date();
  selectedOrderType = '';
  straightLineValue: number;
  modalRight: string;
  modalTop: string;
  marketDepthData: any[];
  displayMarketDepth = false;
  mk: any;
  selectedOption = 'Buy';
  displayChart = true;
  modal: boolean;
  clickedStock: string;
  symbol: any;
  pieChart: Chart;
  doughnutChart: Chart;
  filteredPortfolio: any[]; // Add filteredPortfolio variable
  uniqueTypes: string[]; // Add uniqueTypes variable
  chart: Chart;
  marg: any;

  constructor(
    private stockService: StockService,
    private portfolioService: PortfolioService,
    private forexService: ForexService,
    private commodityService: CommodityService,
    private optionsService: OptionsService,
    private router: Router,
    private navCtrl: NavController,
    private marketdepthService: MarketdepthService
  ) {}

  ngOnInit() {
    this.fetchStocks();
    this.fetchForex();
    this.fetchPortfolio();
    this.marg = this.price * this.quantity;
  }

  fetchStocks() {
    this.stockService.getAllStocks().subscribe((response: any) => {
      this.stocks = response;
      this.initializeBarChart();
      this.updateChart();
      this.startRotation();
    });
  }

  fetchForex() {
    this.forexService.getAllForexs().subscribe((response: any) => {
      this.forex = response;
    });
  }

  fetchPortfolio() {
    this.portfolioService.getAllPortfolio().subscribe((response: any[]) => {
      this.portfolio = response;
      this.filteredPortfolio = response; // Initialize filtered portfolio
      this.uniqueTypes = this.getUniqueTypes(response);
      console.log('Fetched portfolio:', response);
      
      // Initialize an empty object to store aggregated quantities for each stock
      const aggregatedStocks = {};

      // Loop through the portfolio data
      response.forEach((item) => {
        const { stock, quantity, price, target, stoploss, type, totalamount, credit, margininitial, marginmaint, order } = item;
        // If the stock is already in the aggregatedStocks object, add the quantity
        if (aggregatedStocks[stock]) {
          aggregatedStocks[stock].quantity += quantity;
          // If you have multiple prices for the same stock, you might want to adjust how you calculate the aggregated price
          aggregatedStocks[stock].totalPrice += quantity * price;
          aggregatedStocks[stock].target += target;
        } else {
          // If the stock is not in the object, initialize it with the quantity and price
          aggregatedStocks[stock] = {
            quantity,
            totalPrice: quantity * price,
            target,
            stoploss,
            type,
            order,
            totalamount,
            credit,
            margininitial,
            marginmaint
          };
        }
      });

      // Convert the aggregated stocks object to an array of objects
      this.filteredPortfolio = Object.keys(aggregatedStocks).map((stock) => {
        const { quantity, totalPrice, target, stoploss, type, order, totalamount, credit, margininitial, marginmaint } = aggregatedStocks[stock];
        const averagePrice = totalPrice / quantity; // Calculate average price
        //const profit = (this.getCurrentPrice(stock) - averagePrice) * quantity; // Calculate profit

        return {
          stock,
          quantity,
          price: averagePrice,
          totalamount,
          target,
          stoploss,
          type,
          order,
          credit,
          margininitial,
          marginmaint
          // Add any other necessary properties
        };
      });
   
        // Group orders by type
        const ordersByType = this.groupOrdersByType(this.filteredPortfolio);

        // Count symbol occurrences for each type
        const orderCountsByType = {};
        for (const type in ordersByType) {
            orderCountsByType[type] = this.countOrders(ordersByType[type].map(item => item.stock));
        }

        const colors = this.generateColors(this.uniqueTypes);
        this.createMultiLevelPieChart(orderCountsByType, colors); // Initialize the chart with all data
    });
}


getUniqueTypes(portfolio: any[]): string[] {
    return [...new Set(portfolio.map(item => item.type))];
}

countOrders(orders: string[]): { [key: string]: number } {
    return orders.reduce((counts, order) => {
      counts[order] = (counts[order] || 0) + 1;
      return counts;
    }, {});
}

generateColors(types: string[]): string[] {
    // Define an array of predefined light colors
    const predefinedColors = [
      'rgba(255, 206, 86, 0.8)', // Yellow
      'rgba(54, 162, 235, 0.8)', // Blue
      'rgba(255, 99, 132, 0.8)', // Red
      'rgba(75, 192, 192, 0.8)', // Cyan
      // Add more colors as needed
    ];

    // Assign a color to each type, ensuring consistency
    const colors = types.map((type, index) => predefinedColors[index % predefinedColors.length]);

    return colors;
}

filterByType(event: Event) {
  const selectedType = (event.target as HTMLSelectElement).value;
  console.log('Selected type:', selectedType);
  console.log('Portfolio:', this.portfolio);

  if (selectedType === '') {
      this.filteredPortfolio = this.portfolio;
  } else {
      this.filteredPortfolio = this.portfolio.filter(item => item.type === selectedType);
  }

    const ordersByType = this.groupOrdersByType(this.filteredPortfolio);
    const orderCountsByType = {};
    for (const type in ordersByType) {
      orderCountsByType[type] = this.countOrders(ordersByType[type].map(item => item.stock));
    }

    const colors = this.generateColors(Object.keys(orderCountsByType));
    this.updateMultiLevelPieChart(orderCountsByType, colors); // Update the chart with filtered data
}

groupOrdersByType(orders: any[]): { [key: string]: any[] } {
    return orders.reduce((groups, order) => {
      const type = order.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(order);
      return groups;
    }, {});
}

createMultiLevelPieChart(orderCountsByType: { [key: string]: { [key: string]: number } }, colors: string[]) {
  const pieCanvas = document.getElementById('pieChart') as HTMLCanvasElement;
  const ctx = pieCanvas.getContext('2d');

  const datasets = [];
  const labels = []; // Initialize labels array
  for (const type in orderCountsByType) {
      const counts = orderCountsByType[type];
      for (const stock in counts) {
          if (!labels.includes(stock)) { // Ensure stock name is unique
              labels.push(stock); // Push stock name
          }
      }
      const data = labels.map(stock => counts[stock] || 0); // Map count for each stock, 0 if not found
      datasets.push({
          label: type,
          data,
          backgroundColor: colors[datasets.length % colors.length]
      });
  }

  if (!this.pieChart) {
      this.pieChart = new Chart(ctx, {
          type: 'pie',
          data: {
              labels, // Use labels array
              datasets
          },
          options: {
              cutoutPercentage: 0,
              legend: {
                  display: true,
                  position: 'right',
                  labels: {
                      fontColor: '#333'
                  }
              }
          }
      });
  } else {
      this.pieChart.data.labels = labels; // Update labels
      this.pieChart.data.datasets = datasets;
      this.pieChart.update();
  }
}

updateMultiLevelPieChart(orderCountsByType: { [key: string]: { [key: string]: number } }, colors: string[]) {
  const datasets = [];
  const labels = []; // Initialize labels array
  for (const type in orderCountsByType) {
      const counts = orderCountsByType[type];
      for (const stock in counts) {
          if (!labels.includes(stock)) { // Ensure stock name is unique
              labels.push(stock); // Push stock name
          }
      }
      const data = labels.map(stock => counts[stock] || 0); // Map count for each stock, 0 if not found
      datasets.push({
          label: type,
          data,
          backgroundColor: colors[datasets.length % colors.length]
      });
  }

  this.pieChart.data.labels = labels; // Update labels
  this.pieChart.data.datasets = datasets;
  this.pieChart.update();
}



  getClassForOrderType(type: string): string {
    switch (type) {
      case 'forex':
        return 'forex';
      case 'option':
        return 'option';
      case 'stock':
        return 'stock';
      case 'commodity':
        return 'commodity';
      default:
        return '';
    }
  }

  toggleOption() {
    this.selectedOption = this.selectedOption === 'Buy' ? 'Sell' : 'Buy';
  }

  onSubmit(): void {
    const dateTimeString = this.selectedDateTime.toString().slice(0, 19).replace('T', ' ');

    const portfolioData = {
      stock: this.mk,
      type :'stock',
      order:'buy',
      quantity: this.quantity,
      price: this.price,
      triggerprice: this.triggerprice,
      target: this.target,
      stoploss: this.stoploss,
      trailingstoploss: this.trailingstoploss,
      selectedDateTime: dateTimeString,
      selectedOrderType: this.selectedOrderType,
      totalamount: this.quantity * this.price,
    };

    this.portfolioService.createPortfolio(portfolioData).subscribe(
      (response) => {
        console.log('Portfolio created successfully:', response);
      },
      (error) => {
        console.error('Error occurred while creating portfolio:', error);
      }
    );
  }
  
 // Modify your component to include the following method
getUniqueStocks(): any[] {
    const uniqueStocks: any[] = [];

    // Group orders by stock symbol
    const groupedOrders = this.filteredPortfolio.reduce((acc, curr) => {
        if (!acc[curr.stock]) {
            acc[curr.stock] = [];
        }
        acc[curr.stock].push(curr);
        return acc;
    }, {});

    // Calculate aggregated quantity for each stock
    for (const stockSymbol in groupedOrders) {
        if (groupedOrders.hasOwnProperty(stockSymbol)) {
            const orders = groupedOrders[stockSymbol];
            let totalQuantity = 0;
            for (const order of orders) {
                if (order.order === 'buy') {
                    totalQuantity += order.quantity;
                }
            }
            uniqueStocks.push({ stock: stockSymbol, aggregatedQuantity: totalQuantity });
        }
    }

    return uniqueStocks;
}




  startRotation() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.stocks.length;
    }, 3000);
  }

  onSelectionChange(stock: any) {
    if (stock.selected) {
      this.symbol = stock.symbol;
      this.stocks.forEach((s) => {
        if (s !== stock) {
          s.selected = false;
        }
      });
      this.updateChart();
      this.fetchMarketDepthData();
    }
  }

  updateChart() {
    const selectedStocks = this.stocks.filter((stock) => stock.selected);
    const chartData = selectedStocks.map((stock) => ({
      name: stock.symbol,
      data: stock.stock.map((dataPoint) => [
        new Date(dataPoint.Date).getTime(),
        dataPoint.Open,
        dataPoint.High,
        dataPoint.Low,
        dataPoint.Close,
      ]),
    }));

    const chartOptions: any = {
      rangeSelector: {
        selected: 1,
      },
      title: {
        text: 'Stock Prices',
      },
      yAxis: {
        title: {
          text: 'Price',
        },
      },
      series: chartData.map((data) => ({
        type: 'candlestick',
        name: data.name,
        data: data.data,
        color: 'green',
        upColor: 'red',
      })),
    };
      this.mk = selectedStocks.length > 0 ? selectedStocks[0].symbol : null;
    console.log(this.mk);

    const chart = Highcharts.stockChart('chart-container', chartOptions);

    this.addDraggableLines(chart, chartData);
  }

  addDraggableLines(chart: Highcharts.Chart, chartData: any[]) {
    const draggableLines = [
      { name: 'Price Line', value: this.straightLineValue, color: 'blue', target: 'straightLineValue' },
      { name: 'Target Line', value: this.target, color: 'red', target: 'target' },
      { name: 'Stoploss Line', value: this.stoploss, color: 'green', target: 'stoploss' },
    ];

    draggableLines.forEach((lineData) => {
      const dragHandler = function(e: any) {
        const newPrice = chart.yAxis[0].toValue(e.chartY);
        this[lineData.target] = newPrice;
        chart.series.forEach((series) => {
          if (series.name === lineData.name) {
            series.setData(
              [
                [chartData[0].data[0][0], newPrice],
                [chartData[0].data[chartData[0].data.length - 1][0], newPrice],
              ],
              false
            );
          }
        });
        chart.redraw();
      };

      chart.addSeries({
        type: 'line',
        name: lineData.name,
        data: [
          [chartData[0].data[0][0], lineData.value],
          [chartData[0].data[chartData[0].data.length - 1][0], lineData.value],
        ],
        color: lineData.color,
        // drag: dragHandler.bind(this) as any,
      });
    });
  }

  initializeBarChart() {
    const barCanvas = document.getElementById('barChart') as HTMLCanvasElement;
    const labels = ['AAPL', 'AMZN', 'GOOGL', 'MSFT'];
    const data = this.portfolio.map((folio) => folio.totalamount);

    this.barChart = new Chart(barCanvas, {
      type: 'polarArea',
      data: {
        labels,
        datasets: [
          {
            label: 'Sales',
            data,
            backgroundColor: ['#f50a0a', '#f5f50a', '#FFC107', '#11f24d'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  open() {
    this.modal = true;
  }

  close() {
    this.modal = false;
  }

  fetchMarketDepthData() {
    this.marketdepthService.getAllMarketDepth().subscribe(
      (data: any[]) => {
        this.marketDepthData = data.filter((depth: any) => depth.symbol === this.mk);
      },
      (error) => {
        console.error('Error fetching marketDepthData:', error);
      }
    );
  }

  navigateToMissedTab(symbol: string, Symbol: string, type: string) {
    if (type === 'stock') {
     this.selectTabs = 'missed';
      this.router.navigate(['/tabs/tab1/analysis'], { queryParams: { Symbol } });
    } else if (type === 'commodity') {
       this.selectTabs = 'missed';
      this.router.navigate(['/tabs/tile'], { queryParams: { Symbol } });
    } else if (type === 'forex') {
       this.selectTabs = 'missed';
      this.router.navigate(['/tabs/tab3'], { queryParams: { symbol } });
    }
  }

  getTotalOrders(marketDepth: any[], side: string): number {
    return marketDepth.reduce((total, item) => total + (side === 'buy' ? item.buy_quantity : 0), 0);
  }

  getTotalOrder(marketDepth: any[], side: string): number {
    return marketDepth.reduce((total, item) => total + (side === 'sell' ? item.sell_quantity : 0), 0);
  }
}