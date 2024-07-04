import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommodityService } from '../services/commodity.service';
import { Router } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { interval, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CommodityGainerService } from 'src/app/services/commodity-gainer.service';
import { ComindexService } from '../services/comindex.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.page.html',
  styleUrls: ['./tile.page.scss'],
})
export class TilePage implements OnInit {
  coms: any[] = [];
  currentComIndex: number = 0; // Tracks the index of the current stock
  currentDataIndex: number = 0; // Tracks the index of the current data point within the current stock
  private destroy$ = new Subject(); 
  filterTerm: any;
  commoditys: any;
  selectTabs = 'recent';
  index = 0;
   sortOrder: string = ''; 
   buyQuantity: number;
  buyPrice: number;
  sellQuantity: number;
  sellPrice: number;
  selectedStock: any;
  clickedData = '';
  searchTerm = '';
  selectedDatas: any[] = [];
  searchedDatas: any[] = [];
  selectedData: any;
  highestPrices: { [Symbol: string]: number } = {};
  lowestPrices: { [Symbol: string]: number } = {};
  dayRange: { [Symbol: string]: number } = {};
  private intervalId: any;
  allGainers: any[] = [];
  topGainers: any[] = [];
  topLosers: any[] = [];
  errorMessage: string;
  indexData: any;

  constructor(private commodityService: CommodityService, private http: HttpClient, private router: Router,
    private commodityGainerService: CommodityGainerService, private comindexServices: ComindexService,
         private transactionService: TransactionService) { }

  /*ngOnInit() {
    this.loadSelectedComs(); 
  }*/

  ngOnInit() {
    // Fetch initial stock data
    this.fetchComData();
     this.getAllComGainers();
    this.getComGainersLosers();
    this.fetchindex();
    // Load all selected commoditys from the database
    this.loadSelectedComs(); 
    
    // Set up an interval to cycle through each data point every 5 seconds
    interval(5000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
            // Update data points for all selected stocks
            this.updateDataPoints();
        });
}

updateDataPoints() {
    // Iterate through each selected stock
    for (let comIndex = 0; comIndex < this.selectedDatas.length; comIndex++) {
        const selectedData = this.selectedDatas[comIndex];
        
        // Increment the current data point index
        if (selectedData.currentDataIndex === undefined) {
            selectedData.currentDataIndex = 0;
        } else {
            selectedData.currentDataIndex++;
        }
        
        // Check if we've reached the end of the data points for the current stock
        if (selectedData.currentDataIndex >= selectedData.Data.length) {
            // Reset the data index for this stock
            selectedData.currentDataIndex = 0;
        }
    }
}

  fetchComData() {
    this.commodityService.getSelectedComs().subscribe(
      (selectedDatas) => {
        // Update the stocks array with the response data
        this.selectedDatas = selectedDatas;
        console.log( this.selectedDatas );
        // Reset indices if necessary
        this.currentComIndex = 0;
        this.currentDataIndex = 0;
      },
      
    )};
  

  ngOnDestroy() {
    // Signal the interval subscription to stop when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  
  getDataBySymbol(searchTerm: string) {
  if (!searchTerm || searchTerm.trim().length === 0) {
    // If searchTerm is empty or only whitespace
    console.warn("Invalid search term.");
    this.searchedDatas = []; // Clear searchedDatas
    return;
  }

  this.commodityService.getDataBySymbol(searchTerm).subscribe(
    (coms: any[]) => {
      if (coms && coms.length > 0) {
        this.searchedDatas = coms;
        console.log(this.searchedDatas);
      } else {
        console.warn(`Commoditys not found for symbol: ${searchTerm}`);
        this.searchedDatas = []; // Clear searchedDatas if no results found
      }
    },
    (error) => {
      console.error('Error fetching commodity data:', error);
    }
  );
}


  isSelected(Data: any): boolean {
    // Assuming you have a variable to store selected stock
    return this.selectedDatas.some(selectedData => selectedData.id === Data.id);
  }

  
  addSelectedCom(Data: any) {
    this.commodityService.addSelectedCom(Data).subscribe(
      (response) => {
        console.log('Stock marked as selected:', response);
        this.selectedDatas.push(Data); // Update selectedStocks array
        this.searchedDatas = this.searchedDatas.filter(s => s.id !== Data.id); // Remove from searchedStocks
      },
      (error) => {
        console.error('Error marking commodity as selected:', error);
      }
    );
  }

loadSelectedComs() {
this.commodityService.getSelectedComs().subscribe(
  (allSelectedComs) => {
    // Filter only the selected stocks where the 'selected' field is true
    this.selectedDatas = allSelectedComs.filter(Data => Data.selected === true);
    console.log(this.selectedDatas);
  },
  (error) => {
    console.error('Error fetching selected commoditys:', error);
  }
);
}
removeSelectedCom(Data: any) {
this.commodityService.removeSelectedCom(Data).subscribe(
  (response) => {
    console.log('Commodity removed from selected:', response);
    this.selectedDatas = this.selectedDatas.filter(s => s.id !== Data.id); // Remove only the clicked stock
    this.loadSelectedComs(); // Reload selected stocks
  },
  (error) => {
    console.error('Error removing stock from selected:', error);
  }
);
}

  calculateOHLC() {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    this.commoditys.forEach((stockData: any) => {
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

  

   

  updateData() {
    this.index = this.commoditys[0].Data.length - 1; // Update index to point to the last data
  }

  getAskColor(commodity: any): string {
    const askValue = commodity.Data[this.index].Open;
    const bidValue = commodity.Data[this.index].Close;

    if (askValue > bidValue) {
      return '#00FF00'; // Ask value is higher, green color
    } else if (askValue < bidValue) {
      return '#FF0000'; // Bid value is higher, red color
    } else {
      return ''; // No specific color
    }
  }

  getBidColor(commodity: any): string {
    const askValue = commodity.Data[this.index].Open;
    const bidValue = commodity.Data[this.index].Close;

    if (bidValue > askValue) {
      return '#00FF00'; // Bid value is higher, green color
    } else if (bidValue < askValue) {
      return '#FF0000'; // Ask value is higher, red color
    } else {
      return ''; // No specific color
    }
  }

  setClickedData(Symbol: string) {
    this.clickedData = Symbol;
    console.log('Clicked Data:', this.clickedData);
    this.selectTabs = 'missed';
    this.router.navigate(['/tabs/tile'], { queryParams: { Symbol } });
  }

   toggleBuyOptions(com, price: number) {
    com.showBuyOptions = !com.showBuyOptions;
    com.buyPrice = price; // Store the price of the stock
  }

  toggleSellOptions(com, price: number) {
    com.showSellOptions = !com.showSellOptions;
    com.sellPrice = price;
  } 

  buyStock(com) {
    const transactionData = {
      stock: com.symbol,
      quantity: com.buyQuantity,
      price: com.buyPrice,
      totalAmount: com.buyQuantity * com.buyPrice,
      option:'buy'
    };

    this.transactionService.storeTransaction(transactionData).subscribe(
      (response) => {
        console.log('Buy Transaction stored successfully:', response);
        // Additional actions after storing buy transaction
      },
      (error) => {
        console.error('Error storing Buy Transaction:', error);
        // Handle error cases for buy transaction
      }
    );
  }

  sellStock(com) {
    const transactionData = {
      stock: com.symbol,
      quantity: com.sellQuantity,
      price: com.sellPrice,
      totalAmount: com.sellQuantity * com.sellPrice,
      option:'sell'
    };

    this.transactionService.storeTransaction(transactionData).subscribe(
      (response) => {
        console.log('Sell Transaction stored successfully:', response);
        // Additional actions after storing sell transaction
      },
      (error) => {
        console.error('Error storing Sell Transaction:', error);
        // Handle error cases for sell transaction
      }
    );
  }

  doneButtonClicked(com) {
    if (com.showBuyOptions) {
      this.buyStock(com);
    } else if (com.showSellOptions) {
      this.sellStock(com);
    }
    com.showBuyOptions = false; // Hide buy options after transaction
    com.showSellOptions = false; // Hide sell options after transaction
  }

  calculateTotal(quantity: number, price: number): number {
    if (!quantity || !price) {
      return 0;
    }
    return quantity * price;
  }

  sortSymbols() {
  // Toggle sorting order between ascending, descending, and normal
  if (this.sortOrder === '') {
    // Default sorting order (ascending)
    this.selectedDatas.sort((a, b) => a.Symbol.localeCompare(b.Symbol));
    this.sortOrder = 'asc';
  } else if (this.sortOrder === 'asc') {
    // Change to descending order
    this.selectedDatas.sort((a, b) => b.Symbol.localeCompare(a.Symbol));
    this.sortOrder = 'desc';
  } else {
    // Change to normal order (original order)
    this.loadSelectedComs(); // Reload selected stocks to restore the original order
    this.sortOrder = ''; // Reset sorting order
  }
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

   getAllComGainers(): void {
    this.commodityGainerService.getAllComGainers().subscribe(
      data => this.allGainers = data,
      error => this.errorMessage = error.message
    );
  }

  getComGainersLosers(): void {
    this.commodityGainerService.getComGainersLosers().subscribe(
      data => {
        this.topGainers = data.topGainers;
        this.topLosers = data.topLosers;
      },
      error => this.errorMessage = error.message
    );
  }

  fetchindex() {
    this.comindexServices.getComindexs().subscribe(
      (data) => {
        this.indexData = data; // Assign the fetched VIX data to the variable
        console.log('VIX Data:', this.indexData);
        // You can perform further operations with the fetched data here
      },
      (error) => {
        console.error('Error fetching VIX data:', error);
        // Handle errors here
      }
    );
  }
}
