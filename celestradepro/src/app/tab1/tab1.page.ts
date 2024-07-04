import { Component, OnInit, OnDestroy  } from '@angular/core';
import { StockService } from '../services/stock.service';
import { StockGainerService } from '../services/stockgainer.service';
import { Router } from '@angular/router';
import { interval, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { VixService } from '../services/vix.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  stocks: any[] = [];
  currentStockIndex: number = 0; // Tracks the index of the current stock
  currentDataIndex: number = 0; // Tracks the index of the current data point within the current stock
  private destroy$ = new Subject(); 

  filteredStocks: any[] = [];
  filterTerm = '';
  selectTabs = 'recent';
  currentIndex = 0;
  sortOrder: string = ''; 
  searchTerm: string = '';
  clickedStock = '';
  buyQuantity: number;
  buyPrice: number;
  sellQuantity: number;
  sellPrice: number;
  selectedStock: any;
  option = '';
  selectedStocks: any[] = [];
  searchedStocks: any[] = [];
  symbolsOnPage: string[] = [];
  dayRange: number[];
  topGainers: any[] = [];
  topLosers: any[] = [];

  highestPrices: { [symbol: string]: number } = {};
  lowestPrices: { [symbol: string]: number } = {};
  weeklyRange: { low: number; high: number; close: any; open: any; };
  fiftyTwoWeekRange: { low: number; high: number; };
 
  selectedTabs: string = 'recent';
  selectedTab: string = 'gainer';
  tabs = [
    { key: 'gainer', label: 'Top Gainer' },
    { key: 'loser', label: 'Top Loser' },
    { key: 'watchlist', label: 'Watchlist' }
  ];
   vixData: any;

  constructor(private stockService: StockService, private vixService: VixService,
    private router: Router, 
    private stockgainerService: StockGainerService) { }

    
    ngOnInit() {
      // Fetch initial stock data
      this.fetchStockData();
      this.fetchVixData();
      // Load all selected stocks from the database
      this.loadSelectedStocks();
      this.getTopGainersAndLosers();
      
      // Set up an interval to cycle through each data point every 5 seconds
      interval(5000)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
              // Update data points for all selected stocks
              this.updateDataPoints();
             
          });
      
      
  }
  getTopGainersAndLosers(): void {
    this.stockgainerService.getGainersAndLosers().subscribe(
      data => {
        console.log('Response from API:', data); // Debugging line
        // Assume the first half of the array is gainers and the second half is losers
        const halfLength = Math.floor(data.length / 2);
        this.topGainers = data.slice(0, halfLength);
        this.topLosers = data.slice(halfLength);
        console.log('TopGainers:', this.topGainers); // Debugging line
        console.log('TopLosers:', this.topLosers); // Debugging line
      },
      error => console.error('Error fetching top gainers and losers', error)
    );
  }
  
  updateDataPoints() {
      // Iterate through each selected stock
      for (let stockIndex = 0; stockIndex < this.selectedStocks.length; stockIndex++) {
          const selectedStock = this.selectedStocks[stockIndex];
          
          // Increment the current data point index
          if (selectedStock.currentDataIndex === undefined) {
              selectedStock.currentDataIndex = 0;
          } else {
              selectedStock.currentDataIndex++;
          }
          
          // Check if we've reached the end of the data points for the current stock
          if (selectedStock.currentDataIndex >= selectedStock.stock.length) {
              // Reset the data index for this stock
              selectedStock.currentDataIndex = 0;
          }
      }
  }
  
  fetchStockData() {
    this.stockService.getSelectedStocks().subscribe(
      (selectedStocks) => {
        // Update the stocks array with the response data
        this.stocks = selectedStocks;
        console.log(this.stocks);
        
        // Reset indices if necessary
        this.currentStockIndex = 0;
        this.currentDataIndex = 0;
  
      },
      (error) => {
        console.error('Error fetching stock data:', error);
      }
    );
  }
  
    ngOnDestroy() {
      // Signal the interval subscription to stop when the component is destroyed
      this.destroy$.next();
      this.destroy$.complete();
    }
    
  
    getStocksBySymbol(searchTerm: string) {
      if (!searchTerm || searchTerm.trim().length === 1) {
        console.warn("Invalid search term.");
        return;
      }
  
      this.stockService.getStockBySymbol(searchTerm).subscribe(
        (stocks: any[]) => {
          if (stocks && stocks.length > 0) {
            this.searchedStocks = stocks;
            console.log(this.searchedStocks);
          } else {
            console.warn(`Stocks not found for symbol: ${searchTerm}`);
            // Clear searched stocks if no stocks found for the symbol
            this.searchedStocks = [];
          }
        },
        (error) => {
          console.error('Error fetching stock data:', error);
        }
      );
    }
  
    isSelected(stock: any): boolean {
      // Assuming you have a variable to store selected stock
      return this.selectedStocks.some(selectedStock => selectedStock.id === stock.id);
    }
  
    addSelectedStock(stock: any) {
      this.stockService.addSelectedStock(stock).subscribe(
        (response) => {
          console.log('Stock marked as selected:', response);
          this.selectedStocks.push(stock); // Update selectedStocks array
          this.searchedStocks = this.searchedStocks.filter(s => s.id !== stock.id); // Remove from searchedStocks
        },
        (error) => {
          console.error('Error marking stock as selected:', error);
        }
      );
    }
  
loadSelectedStocks() {
  this.stockService.getSelectedStocks().subscribe(
    (allSelectedStocks) => {
      // Filter only the selected stocks where the 'selected' field is true
      this.selectedStocks = allSelectedStocks.filter(stock => stock.selected === true);
      console.log(this.selectedStocks);
    },
    (error) => {
      console.error('Error fetching selected stocks:', error);
    }
  );
   this.symbolsOnPage = this.getSymbolsOnPage();
}
removeSelectedStock(stock: any) {
  this.stockService.removeSelectedStock(stock).subscribe(
    (response) => {
      console.log('Stock removed from selected:', response);
      this.selectedStocks = this.selectedStocks.filter(s => s.id !== stock.id); // Remove only the clicked stock
      this.loadSelectedStocks(); // Reload selected stocks
    },
    (error) => {
      console.error('Error removing stock from selected:', error);
    }
  );
}


    getClickedStock(symbol: string) {
      this.clickedStock = symbol;
      console.log('Clicked Stock:', this.clickedStock);
    
      this.stockService.getStockBySymbol(symbol).subscribe((stock: any) => {
        if (stock) {
          // Data successfully fetched, assign it to a variable
          this.selectedStock = stock;
          // You can now access and display stock.symbol or other properties
        } else {
          // Handle the case where no stock data is found
          console.error('Stock data not found for symbol:', symbol);
        }
      });
    }
    getStocks() {
      this.stockService.getAllStocks().subscribe((response: any[]) => {
          this.stocks = response;
          console.log(response);
          // Optionally, you can call other functions here as needed
         // this.calculateTopGainerAndLoser();
          this.calculate52WeekRange();
      });
  }
  
    calculate52WeekRange() {
      // Assuming stocks are sorted by date, if not, sort them by date first.
      const today = new Date();
      const fiftyTwoWeeksAgo = new Date(today.getTime() - 52 * 7 * 24 * 60 * 60 * 1000);
    
      this.fiftyTwoWeekRange = {
        low: Number.MAX_VALUE,
        high: Number.MIN_VALUE
      };
    
      for (const stock of this.stocks) {
        const stockDate = new Date(stock.Date);
        if (stockDate >= fiftyTwoWeeksAgo && stockDate <= today) {
          if (stock.Low < this.fiftyTwoWeekRange.low) {
            this.fiftyTwoWeekRange.low = stock.Low;
          }
          if (stock.High > this.fiftyTwoWeekRange.high) {
            this.fiftyTwoWeekRange.high = stock.High;
          }
        }
      }
    
      // If no data found for the last 52 weeks, set to null
      if (this.fiftyTwoWeekRange.low === Number.MAX_VALUE || this.fiftyTwoWeekRange.high === Number.MIN_VALUE) {
        this.fiftyTwoWeekRange = null;
      }
    }

    
    
  calculateOHLC() {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    this.stocks.forEach((stockData: any) => {
      const stockInRange = stockData.stock.filter((data: any) => {
        const stockDate = new Date(data.Date);
        return stockDate >= oneYearAgo && stockDate <= today;
      });

      if (stockInRange.length > 0) {
        const symbol = stockData.symbol;
        const highPrices = stockInRange.map((data: any) => data.High);
        const lowPrices = stockInRange.map((data: any) => data.Low);

        this.highestPrices[symbol] = Math.max(...highPrices);
        this.lowestPrices[symbol] = Math.min(...lowPrices);
      } else {
        this.highestPrices[stockData.symbol] = 0;
        this.lowestPrices[stockData.symbol] = 0;
      }
    });
  }

  filterData() {
    if (this.filterTerm) {
      this.filteredStocks = this.stocks.filter((stockData: any) =>
        stockData.symbol.toLowerCase().includes(this.filterTerm.toLowerCase())
      );
    } else {
      this.filteredStocks = this.stocks;
    }
  }
  selectTab(tabKey: string) {
    this.selectedTab = tabKey;
  }
 
  
  openTab(event: any, cityName: string) {
    const tabcontent = document.getElementsByClassName("tabcontent") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    const tablinks = document.getElementsByClassName("tablinks") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    const cityElement = document.getElementById(cityName);
    if (cityElement) {
      cityElement.style.display = "block";
    }
    event.currentTarget.className += " active";
  }
  


  setClickedStock(symbol: string) {
    this.clickedStock = symbol;
    console.log('Clicked Stock:', this.clickedStock);
   // this.router.navigate(['/tabs/tab1/analysis/:symbol'], { queryParams: { symbol  } });
    this.selectTabs = 'missed';
    this.router.navigate(['/tabs/tab1/'], { queryParams: { symbol } });
  }



 toggleBuyOptions(stock, price: number) {
    stock.showBuyOptions = !stock.showBuyOptions;
    stock.buyPrice = price; // Store the price of the stock
  }

  toggleSellOptions(stock, price: number) {
    stock.showSellOptions = !stock.showSellOptions;
    stock.sellPrice = price;
  } 

  
 sortSymbols() {
  // Toggle sorting order between ascending, descending, and normal
  if (this.sortOrder === '') {
    // Default sorting order (ascending)
    this.selectedStocks.sort((a, b) => a.symbol.localeCompare(b.symbol));
    this.sortOrder = 'asc';
  } else if (this.sortOrder === 'asc') {
    // Change to descending order
    this.selectedStocks.sort((a, b) => b.symbol.localeCompare(a.symbol));
    this.sortOrder = 'desc';
  } else {
    // Change to normal order (original order)
    this.loadSelectedStocks(); // Reload selected stocks to restore the original order
    this.sortOrder = ''; // Reset sorting order
  }
  }
  
     getSymbolsOnPage(): string[] {
    return this.selectedStocks.map(stock => stock.symbol);
  }

  fetchVixData() {
    this.vixService.getVixs().subscribe(
      (data) => {
        this.vixData = data; // Assign the fetched VIX data to the variable
        console.log('VIX Data:', this.vixData);
        // You can perform further operations with the fetched data here
      },
      (error) => {
        console.error('Error fetching VIX data:', error);
        // Handle errors here
      }
    );
  }

}
