import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { OptionsService } from '../services/options.service';
import { OptionsChainService } from '../services/optionschain.service';
import { StockService } from '../services/stock.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  selectedTab: number = 1;

  selectTab(tabNumber: number) {
      this.selectedTab = tabNumber;
  }
  filteredOptions: any[] = [];
  symbols: string[] = ['AAPL', 'MSFT', 'GOOGL','NIFTY']; // Example symbol
  expiries: string[] = ['09-05-2024', '2024-08-19', '2024-09-19']; // Example expiry dates
  strikePrices: number[] = [22900,22300,22150, 200];

  selectedSegment: any;
  
  selectedSymbol: string ;
  selectedExpiry: string = this.expiries[0];
  selectedStrikePrice: number =this.strikePrices[0];
  stocks: any[] = [];

  options: any[] = [];
  optionschain: any;
  clickedOptions: string;
  selectTabs = 'recent';
  index = 0;
  private intervalId: any;
  filtered: any = {}; // Initialize filtered object to avoid undefined error

  constructor(
    private optionsService: OptionsService,
    private router: Router,
    private route: ActivatedRoute,
    private optionschainService: OptionsChainService,
    private stockService: StockService
  ) {}

  ngOnInit() {
    this.loadOptions();
    this.loadOptionsChain();
    this.fetchStockData();

    this.route.queryParams.subscribe(params => {
      if (params['segment'] === 'contacts') {
        this.selectTabs = 'contacts'; // Change to the desired tab if necessary
        this.activeContent = params['content'] || 'recent'; // Default to 'recent' if no content specified
      }
    });

  }

  activeContent: string = ''; // Initially no content is active


  showContent(content: string, event: Event) {
    if (this.activeContent === content) {
      // If the clicked content is already active, hide it
      this.activeContent = '';
    } else {
      // Show the new content and hide the previous one
      this.activeContent = content;
    }
  
    // Scroll the clicked details item to the top
    const targetElement = (event.target as HTMLElement).parentElement;
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  
    // Handle highlight effect
    const allDetails = document.querySelectorAll('.sidebar details');
    allDetails.forEach(details => details.classList.remove('active'));
  
    const detailsElement = targetElement as HTMLDetailsElement;
    if (detailsElement && detailsElement.hasAttribute('open')) {
      detailsElement.classList.add('active');
    }
  }
 

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadOptions(): void {
    this.optionsService.getOptions().subscribe((options: any[]) => {
      this.options = options;
       this.filteredOptions = this.options;
    });
  }
  fetchStockData() {
    this.stockService.getSelectedStocks().subscribe(
      (selectedStocks) => {
        // Update the stocks array with the response data
        this.stocks = selectedStocks;
        console.log(this.stocks);
      },
      (error) => {
        console.error('Error fetching stock data:', error);
      }
    );
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }


  onSymbolChange(event: Event): void {
    this.filterOptions();
  }

  onExpiryChange(event: Event): void {
    this.filterOptions();
  }

  onStrikePriceChange(event: Event): void {
    this.filterOptions();
  }

  filterOptions(): void {
    this.filteredOptions = this.options.filter(option => {
      return (!this.selectedSymbol || option['Underlying Name'] === this.selectedSymbol) &&
             (!this.selectedExpiry || option['Expiration Date'] === this.selectedExpiry) &&
             (this.selectedStrikePrice  === null   || option['Strike Price'] === this.selectedStrikePrice);
    });
  }
  loadOptionsChain() {
    this.optionschainService.getoptions().subscribe((optionschain: any[]) => {
      this.optionschain = optionschain;
      console.log(this.optionschain);
    });
  }

  stopAutoReload() {
    clearInterval(this.intervalId);
  }

  resetIndex() {
    this.index = 0;
  }

  updateLastUpdatedTime() {
    const currentTime = new Date();
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
      lastUpdatedElement.innerText = currentTime.toISOString(); // Update the last updated time on the page
    }
  }

  getStrikeColor(callStrike: number, putStrike: number, type: string): string {
    if (callStrike > putStrike) {
      return type === 'call' ? 'green' : 'red'; // Higher value, apply green for call and red for put
    } else if (callStrike < putStrike) {
      return type === 'call' ? 'red' : 'green'; // Lower value, apply red for call and green for put
    } else {
      return 'blue'; // Same value, apply blue
    }
  }

  getLastPriceColor(callLastPrice: number, putLastPrice: number, type: string): string {
    if (callLastPrice > putLastPrice) {
      return type === 'call' ? 'green' : 'red'; // Higher value, apply green for call and red for put
    } else if (callLastPrice < putLastPrice) {
      return type === 'call' ? 'red' : 'green'; // Lower value, apply red for call and green for put
    } else {
      return 'blue'; // Same value, apply blue
    }
  }

  setClickedOptions(symbol: string) {
    this.clickedOptions = symbol;
    console.log('Clicked Options:', this.clickedOptions);
    this.selectTabs = 'missed';
    this.router.navigate(['/tabs/tab2'], { queryParams: { symbol } });
  }
}
