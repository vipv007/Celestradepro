import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { StockService } from '../services/stock.service';

@Component({
  selector: 'app-sp',
  templateUrl: './sp.page.html',
  styleUrls: ['./sp.page.scss'],
})
export class SpPage {
 
    email: string = '';
    isLoggedIn: boolean = false;
    watchlist: any[] = [];
    availableStocks: any[] = [];
    unstoredStocks: any[] = [];
    filteredUnstoredStocks: any[] = [];
    filterText: string = '';
  
    constructor(private userService: UserService, private stockService: StockService) {}
  
    onLogin() {
      this.userService.storeEmail(this.email).subscribe(
        response => {
          this.isLoggedIn = true;
          this.fetchWatchlist();
        },
        error => {
          console.error('Error storing email:', error);
        }
      );
    }
  
    fetchWatchlist() {
      this.userService.getWatchlist(this.email).subscribe(
        response => {
          this.watchlist = response.watchlist || [];
          this.loadAvailableStocks();
        },
        error => {
          console.error('Error fetching watchlist:', error);
        }
      );
    }
  
    loadAvailableStocks() {
      this.stockService.getAllStocks().subscribe(
        (stocks: any[]) => {
          this.availableStocks = stocks;
          this.filterUnstoredStocks();
        },
        error => {
          console.error('Error fetching available stocks:', error);
        }
      );
    }
  
    filterUnstoredStocks() {
      this.unstoredStocks = this.availableStocks.filter(stock => 
        !this.watchlist.some(w => w.symbol === stock.symbol)
      );
  
      if (this.filterText) {
        this.filteredUnstoredStocks = this.unstoredStocks.filter(stock =>
          stock.symbol.toLowerCase().includes(this.filterText.toLowerCase())
        );
      } else {
        this.filteredUnstoredStocks = [...this.unstoredStocks];
      }
    }
  
    onAddStock(stock: any) {
      if (!this.isStockInWatchlist(stock)) {
        const firstStockObject = {
          symbol: stock.symbol,
          name: stock.name,
          open: stock.stock[0].Open,
          high: stock.stock[0].High,
          low: stock.stock[0].Low,
          close: stock.stock[0].Close,
          volume: stock.stock[0].Volume
        };
        
        this.watchlist.push(firstStockObject);
        this.userService.addToWatchlist(this.email, this.watchlist).subscribe(
          response => {
            console.log('Stock added to watchlist successfully');
            this.filterUnstoredStocks(); // Refresh the unstored stocks list
          },
          error => {
            console.error('Error adding stock to watchlist:', error);
          }
        );
      }
    }
  
    onDeleteStock(stock: any) {
      this.watchlist = this.watchlist.filter(s => s.symbol !== stock.symbol);
      this.userService.addToWatchlist(this.email, this.watchlist).subscribe(
        response => {
          console.log('Stock removed from watchlist successfully');
          this.filterUnstoredStocks(); // Refresh the unstored stocks list
        },
        error => {
          console.error('Error removing stock from watchlist:', error);
        }
      );
    }
  
    isStockInWatchlist(stock: any): boolean {
      return this.watchlist.some(s => s.symbol === stock.symbol);
    }
  }
  