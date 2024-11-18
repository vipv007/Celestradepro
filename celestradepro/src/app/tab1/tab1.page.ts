import { Component, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { StockService } from '../services/stock.service';
import { StockGainerService } from '../services/stockgainer.service';
import { Router } from '@angular/router';
import { interval, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { VixService } from '../services/vix.service';
import { SectorService } from '../services/sector.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  selectedTabe: string = 'live'; // Default to "Live" tab
  setTabe(tab: string) {
    this.selectedTabe = tab;
  }

  stocks: any[] = [];
  private destroy$ = new Subject(); 
  technicals: any[] = [];
  sectors: string[] = [];
  selectedSector: string | null = null;
  title = 'Sectors Information';
  filteredStocks: any[] = [];
  filterTerm = '';
  selectTabs = 'recent';
  currentIndex = 0;
  sortOrder: string = ''; 
  searchTerm: string = '';
  clickedStock = ''; 
 
  selectedStock: any;
  option = '';
 
  @ViewChild('gainerChartCanvas', { static: false }) gainerChartCanvas;
  @ViewChild('loserChartCanvas', { static: false }) loserChartCanvas;
  
  gainerChart: any;
  loserChart: any;

  gainerChartLabels: string[] = [];
  loserChartLabels: string[] = [];

  gainerChartData = [
    { data: [], label: 'Change%', backgroundColor: 'green', borderColor: 'green', borderWidth: 1 }
  ];
  
  loserChartData = [
    { data: [], label: 'Change%', backgroundColor: 'red', borderColor: 'red', borderWidth: 1 }
  ];

  showChart: boolean = true;
  showTable: boolean = true;
  showLoserChart: boolean = true;
  showLoserTable: boolean = true;
  topGainers: any = [];
  topLosers: any = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: '#FFFFFF',
          fontSize: 14,
        }
      }],
      yAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: '#FFFFFF',
          fontSize: 14,
        }
      }]
    },
    legend: {
      labels: {
        fontColor: '#FFFFFF',
        fontSize: 14
      }
    }
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = false;
  public barChartData = [
    { data: [], label: '' }
  ];

  public barChartColors: Color[] = [
    {
      backgroundColor: []
    }
  ];


  email: string = '';
  isLoggedIn: boolean = false;
  watchlist: any[] = [];
  availableStocks: any[] = [];
  unstoredStocks: any[] = [];
  filteredUnstoredStocks: any[] = [];
  filterText: string = '';
  
  selectedTabs: string = 'recent';
  selectedTab: string = 'gainer';

  tabs = [
    { key: 'gainer', label: 'Top Gainer' },
    { key: 'loser', label: 'Top Loser' },
   // { key: 'watchlist', label: 'Watchlist' }
  ];
  
   vixData: any;
   selectedSegment: any;

  constructor(private stockService: StockService, private vixService: VixService,private sectorService: SectorService,
    private router: Router, 
    private userService: UserService,
    private route: ActivatedRoute,
    private stockgainerService: StockGainerService) { }

    
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        console.log('Query Params:', params);  // Debug log
        this.selectTabs = params['segment'] || 'recent';
        this.activeContent = params['content'] || 'watchlist';
        this.openTab(null, this.activeContent);  // Ensure to open the correct tab
      });
      this.route.queryParams.subscribe(params => {
        if (params['segment'] === 'recent') {
          this.selectTabs = 'recent'; // Set the tab to 'recent'
          this.activeContent = params['content'] || 'gainer'; // Default to 'gainer' if no content specified
        }
      });
      

      
    
    
     this.email = this.userService.getEmail(); // Get the email from the service
    if (this.email) {
      this.fetchWatchlist();
      //this.fetchTrendStocks(); // Fetch trend stocks if logged in
    } else {
      this.fetchMostActiveStocks(); // Fetch most active stocks if not logged in
      console.error('No email found, please login first.');
    }

      this.openTab(null, 'watchlist'); // Automatically load the watchlist tab
      this.fetchWatchlist();
      this.loadAvailableStocks();
      this.fetchVixData();
      this.fetchTechnical();
      // Load all selected stocks from the database
     
      this.getTopGainersAndLosers();
      
      // Set up an interval to cycle through each data point every 5 seconds
      interval(5000)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
             
             
          });
      
      
  }

  

  activeContent: string = 'NEWS'; // No default content shown initially

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

  // Define variables to store the selected view for gainer and loser
viewGainer: 'chart' | 'table' = 'chart';
viewLoser: 'chart' | 'table' = 'chart';

  
getTopGainersAndLosers(): void {
  this.stockgainerService.getGainersAndLosers().subscribe(
    data => {
      // Filter gainers and losers based on the 'type' field
      const gainers = data.filter(stock => stock.type === 'gainer');
      const losers = data.filter(stock => stock.type === 'loser');

      this.gainerChartLabels = gainers.map(g => g.symbol);
      this.gainerChartData[0].data = gainers.map(g => parseFloat(g.change));
      this.topGainers = gainers;

      // Populate data for losers
      this.loserChartLabels = losers.map(l => l.symbol);
      this.loserChartData[0].data = losers.map(l => parseFloat(l.change));
      this.topLosers = losers;

    },
    error => {
      console.error('Error fetching gainers and losers data', error);
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
          
      });
  }
  
    
 
  selectTab(tabKey: string) {
    this.selectedTab = tabKey;
  }
 
  openTab(event: any, cityName: string) {
    // Hide all tab contents
    const tabcontent = document.getElementsByClassName("tabcontent") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Deactivate all tab links
    const tablinks = document.getElementsByClassName("tablinks") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the selected tab content
    const cityElement = document.getElementById(cityName);
    if (cityElement) {

        cityElement.style.display = "block";
    } else {
        console.error(`Tab content not found for: ${cityName}`);

    }
  
    // If event is valid, add the "active" class to the clicked tab link
    if (event && event.currentTarget) {
      event.currentTarget.className += " active";
    } else {

      // If no event, set the "Watchlist" tab as active
      const watchlistTab = document.querySelector('.tablinks:first-child');
      if (watchlistTab) {
        watchlistTab.className += " active";
      }
    }
  
    // Check if 'cityName' matches 'gainer' and set the appropriate segment and content
    if (cityName === 'gainer') {
      this.router.navigate(['/celestradepro/Stocks'], {
        queryParams: { segment: 'recent', content: 'gainer' }
      });
    }
  }
  
  setClickedStock(symbol: string) {
    this.clickedStock = symbol;
    console.log('Clicked Stock:', this.clickedStock);
    this.selectTabs = 'missed';
    this.router.navigate(['/celestradepro/Stocks'], { queryParams: { symbol } });
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
  fetchTechnical(): void {
    this.sectorService.getSector().subscribe((response: any) => {
      this.technicals = response;
      this.sectors = response.map((technical: any) => technical.title);
      console.log(this.technicals);
    });
  }

  onSelectSector(sector: string): void {
    this.selectedSector = sector;
  }

  getSelectedSectorData(): any[] {
    if (!this.selectedSector) {
      return [];
    }
    const sectorData = this.technicals.find(technical => technical.title === this.selectedSector);
    return sectorData ? sectorData.data : [];
  }


   
  fetchMostActiveStocks() {
    // Implement your logic to fetch most active stocks
    this.stockService.getAllStocks().subscribe((stocks) => {
      this.unstoredStocks = stocks;
      this.filterUnstoredStocks();
    });
  }




  fetchWatchlist() {
    this.userService.getWatchlist(this.email).subscribe(
      response => {
        console.log('Fetched watchlist:', response); // Debugging line
        const fullWatchlist = response.watchlist || [];
        // Filter the watchlist to only include items with type 'stock'
        this.watchlist = fullWatchlist.filter(item => item.type === 'stock');
        this.filterUnstoredStocks(); // Refresh the unstored stocks list after fetching watchlist
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
        console.log (this.availableStocks );
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
      const newStock = {
        symbol: stock.symbol,
        open: stock.stock[0].Open,
        high: stock.stock[0].High,
        low: stock.stock[0].Low,
        close: stock.stock[0].Close,
        volume: stock.stock[0].Volume,
        type: 'stock' // Explicitly setting the type as 'stock'
      };
  
      this.watchlist.push(newStock);
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
    // Remove the stock from the local watchlist array
    this.watchlist = this.watchlist.filter(s => s.symbol !== stock.symbol);

    // Call the backend to remove the stock from the database
    this.userService.removeFromWatchlist(this.email, stock.symbol).subscribe(
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