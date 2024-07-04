import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockService } from '../services/stock.service';

@Component({
  selector: 'app-cres',
  templateUrl: './cres.page.html',
  styleUrls: ['./cres.page.scss'],
})
export class CresPage implements OnInit {

  stocks: any[] = [];
  stockData: any = {}; // Object to hold data for each stock symbol
  selectedSymbol: string | null = null; // Variable to hold the currently selected symbol

  constructor(private stockService: StockService, private router: Router) {}

  ngOnInit() {
    this.fetchStocks();
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

  onSymbolChange(event: any) {
    this.selectedSymbol = event.target.value; // Update the selected symbol based on radio button change
  }
}
