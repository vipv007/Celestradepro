import { Component, OnInit } from '@angular/core';
import { DividendService } from 'src/app/services/dividend.service';
import { StockService } from 'src/app/services/stock.service';
import { UserService } from 'src/app/services/user.service';  // Import UserService to fetch user's watchlist

@Component({
  selector: 'app-dividend',
  templateUrl: './dividend.component.html',
  styleUrls: ['./dividend.component.scss'],
})
export class DividendComponent implements OnInit {

  dividends: any[] = [];
  selectedSymbols: string[] = [];

  constructor(
    private dividendService: DividendService, 
    private stockService: StockService, 
    private userService: UserService  // Inject UserService
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();  // Check login status on init
  }

  checkLoginStatus(): void {
    const email = this.userService.getEmail();  // Get the user's email from the service
    
    if (email) {
      this.fetchUserSymbols();  // Fetch user's symbols if logged in
    } else {
      this.fetchDividendsForDefault(); // Fetch data for the first symbol in the default collection
    }
  }

  fetchUserSymbols(): void {
    const email = this.userService.getEmail();  // Get the user's email from the service
    this.userService.getWatchlist(email).subscribe(
      (response: any) => {
        this.selectedSymbols = response.watchlist.map((item: any) => item.symbol);
        if (this.selectedSymbols.length > 0) {
          this.fetchDividendsForSelectedStocks();
        } else {
          console.log('No symbols selected.');
          // Handle the case where no symbols are selected
        }
      },
      error => {
        console.error('Error fetching user symbols:', error);
      }
    );
  }

  fetchDividendsForSelectedStocks(): void {
    this.dividendService.getDividend().subscribe((response: any[]) => {
      // Filter dividend data to include only the symbols in the user's watchlist
      this.dividends = response.filter(item => this.selectedSymbols.includes(item.symbol));
      console.log(this.dividends);
    },
    error => {
      console.error('Error fetching dividend data', error);
    });
  }

  fetchDividendsForDefault(): void {
    this.dividendService.getDividend().subscribe((response: any[]) => {
      // Check if there are any symbols in the response and use the first one
      if (response.length > 0) {
        const firstSymbol = response[0].symbol; // Get the first symbol from the response
        this.dividends = response.filter(item => item.symbol === firstSymbol);
        console.log(this.dividends);
      } else {
        console.log('No dividend data available.');
        // Handle the case where no dividend data is available
      }
    },
    error => {
      console.error('Error fetching dividend data', error);
    });
  }
}
