import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  earns: any[] = [];
  chunkedEarns: any[][] = [];
  selectedSymbols: string[] = [];

  constructor(private profileService: ProfileService, private stockService: StockService) {}

  ngOnInit() {
    this.fetchSelectedStocks();
  }

  fetchSelectedStocks() {
    this.stockService.getSelectedStocks().subscribe((selectedStocks: any[]) => {
      this.selectedSymbols = selectedStocks
        .filter(stock => stock.selected)
        .map(stock => stock.symbol);

      if (this.selectedSymbols.length > 0) {
        console.log('sample', this.selectedSymbols);
        this.fetchProfileForSelectedSymbols();
      } else {
        console.log('No symbols selected.');
        // Handle the case where no symbols are selected
      }
    });
  }

  fetchProfileForSelectedSymbols() {
    this.profileService.getAllProfiles().subscribe((response: any[]) => {
      this.selectedSymbols.forEach(symbol => {
        const selectedProfiles = response.filter(profile => profile.ticker === symbol);
        console.log('Selected Profiles for', symbol + ':', selectedProfiles);
        this.earns.push(...selectedProfiles);
      });
      // Divide 'earns' array into chunks of 4 elements each
      this.chunkedEarns = this.chunkArray(this.earns, 4);
    });
  }

  // Function to chunk an array into smaller arrays
  chunkArray(array: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, index * size + size)
    );
  }
}
