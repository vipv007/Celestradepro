import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { StockService } from '../../services/stock.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  earns: any[] = [];
  chunkedEarns: any[][] = [];
  watchlistSymbols: string[] = [];
  selectedStockSymbol: string;

  constructor(
    private profileService: ProfileService,
    private stockService: StockService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const email = this.userService.getEmail();
    if (email) {
      this.fetchWatchlistSymbols(); // Fetch watchlist symbols if logged in
    } else {
      this.fetchDefaultProfile(); // Fetch default profile if not logged in
    }
  }

  fetchWatchlistSymbols() {
    const email = this.userService.getEmail(); // Get the user's email from the service
    this.userService.getWatchlist(email).subscribe((response: any) => {
      this.watchlistSymbols = response.watchlist.map((item: any) => item.symbol);
      if (this.watchlistSymbols.length > 0) {
        this.fetchProfileForWatchlistSymbols();
      } else {
        console.log('No symbols in watchlist.');
        // Handle the case where no symbols are in the watchlist
      }
    });
  }

  fetchProfileForWatchlistSymbols() {
    this.profileService.getAllProfiles().subscribe((response: any[]) => {
      this.earns = response.filter(profile => this.watchlistSymbols.includes(profile.ticker));
      this.chunkedEarns = this.chunkArray(this.earns, 4);
    });
  }

  fetchDefaultProfile() {
    this.profileService.getAllProfiles().subscribe((response: any[]) => {
      if (response.length > 0) {
        const firstSymbol = response[0].ticker; // Get the first symbol from the response
        this.earns = response.filter(profile => profile.ticker === firstSymbol);
        this.chunkedEarns = this.chunkArray(this.earns, 4);
      } else {
        console.log('No profile data available.');
        // Handle the case where no profile data is available
      }
    });
  }

  chunkArray(array: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, index * size + size)
    );
  }

  isHighlighted(ticker: string): boolean {
    return this.watchlistSymbols.includes(ticker);
  }
}
