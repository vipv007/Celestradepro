import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommodityService } from '../services/commodity.service';
import { Router } from '@angular/router';
import { interval, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CommodityGainerService } from 'src/app/services/commodity-gainer.service';
import { ComindexService } from '../services/comindex.service';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { UserService } from '../services/user.service';
import Chart from 'chart.js';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.page.html',
  styleUrls: ['./tile.page.scss'],
})
export class TilePage implements OnInit {

  selectedTabe: string = 'live'; // Default to "Live" tab
  setTabe(tab: string) {
    this.selectedTabe = tab;
  }
  selectedTab = 1;
  coms: any[] = [];
   
  filterTerm: any;
  commoditys: any;
  selectTabs = 'recent';
  index = 0;
  sortOrder: string = ''; 
  selectedStock: any;
  clickedData = '';
  searchTerm = '';
  selectedDatas: any[] = [];
  searchedDatas: any[] = [];
  selectedData: any;
  allGainers: any[] = [];
  topGainers: any[] = [];
  topLosers: any[] = [];
  errorMessage: string;
  indexData: any;
 
  displayMode: string = 'table'; 

  energyData = [];
  agricultureData = [];
  metalsData = [];
  livestockData = [];

  // Chart data
  energyChartData = [];
  agricultureChartData = [];
  metalsChartData = [];
  livestockChartData = [];

  // Chart labels
  energyLabels: Label[] = [];
  agricultureLabels: Label[] = [];
  metalsLabels: Label[] = [];
  livestockLabels: Label[] = [];

  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{ ticks: { beginAtZero: true } }]
    }
  };


  email: string = '';
  isLoggedIn: boolean = false;
  watchlist: any[] = [];
  availablecoms: any[] = [];
  unstoredcoms: any[] = [];
  filteredUnstoredcoms: any[] = [];
  filterText: string = '';

 

  gainerChartLabels: string[] = [];
  loserChartLabels: string[] = [];

  gainerChartData = [
    { data: [], label: 'Change%', borderWidth: 1 ,backgroundColor: 'rgba(75, 192, 192, 0.6)', // Background colors
    borderColor: 'rgba(75, 192, 192, 1)' }
  ];
  
  loserChartData = [
    { data: [], label: 'Change%',  borderWidth: 1 ,  backgroundColor:  'rgba(255, 99, 132, 0.6)', // Background colors
    borderColor:  'rgba(255, 99, 132, 0.6)', // Border colors
   }
  ];



  constructor(private commodityService: CommodityService,
     private http: HttpClient,
      private router: Router,
    private commodityGainerService: CommodityGainerService,
     private comindexServices: ComindexService,
     private route: ActivatedRoute,
    private userService: UserService) { }

    
    
    ngOnInit() {

    this.email = this.userService.getEmail(); // Get the email from the service
    if (this.email) {
      this.fetchWatchlist();
    } else {
      this.loadAvailablecoms();
      console.error('No email found, please login first.');
    }

    this.openTab(null, 'watchlist'); // Automatically load the watchlist tab
    this.fetchWatchlist();
    this.loadAvailablecoms();
     this.getAllComGainers();
    this.getComGainersLosers();
    this.fetchindex();
   
    this.route.queryParams.subscribe(params => {
      if (params['segment'] === 'contacts') {
        this.selectTabs = 'contacts'; // Change to the desired tab if necessary
        this.activeContent = params['content'] || 'recent'; // Default to 'recent' if no content specified
      }
    });
}

activeContent: string = 'NEWS'; // Initially no content is active


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
    this.router.navigate(['/celestradepro/Futures'], { queryParams: { Symbol } });
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
    
    this.sortOrder = ''; // Reset sorting order
  }
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
  }


   getAllComGainers(): void {
    this.commodityGainerService.getAllComGainers().subscribe(
      data => this.allGainers = data,
      error => this.errorMessage = error.message
    );
  }
 
  viewGainer: 'chart' | 'table' = 'chart';
viewLoser: 'chart' | 'table' = 'chart';

// Method to fetch top gainers and losers
getComGainersLosers(): void {
  this.commodityGainerService.getComGainersLosers().subscribe(
    data => {
      // Populate data for gainers
      this.gainerChartLabels = data.topGainers.map(g => g.Name);
      this.gainerChartData[0].data = data.topGainers.map(g => parseFloat(g.Changeper.replace('%', '')));
      this.topGainers = data.topGainers;

      // Populate data for losers
      this.loserChartLabels = data.topLosers.map(l => l.Name);
      this.loserChartData[0].data = data.topLosers.map(l => parseFloat(l.Changeper.replace('%', '')));
      this.topLosers = data.topLosers;

      
    },
    error => console.error('Error fetching top gainers and losers', error)
  );
}




  fetchindex() {
    this.comindexServices.getComindexs().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.separateDataBySector(data);
        } else {
          console.error('Expected data to be an array but got', data);
        }
      },
      (error) => {
        console.error('Error fetching commodities data:', error);
      }
    );
  }

  separateDataBySector(data: any[]) {
    this.energyData = data.filter(item => item.Sector === 'Energy');
    this.agricultureData = data.filter(item => item.Sector === 'Agriculture');
    this.metalsData = data.filter(item => item.Sector === 'Metals');
    this.livestockData = data.filter(item => item.Sector === 'Livestock');
    
    // Prepare chart data and labels
    this.prepareChartData();
  }

  prepareChartData() {
    // Energy chart data with dynamic colors
    this.energyLabels = this.energyData.map(item => item.Name);
    this.energyChartData = [
      
      {
        data: this.energyData.map(item => item.High),
        label: 'High Price',
        backgroundColor: this.energyData.map(item => this.getBarColor(item.High)) // Apply color based on value
      },
      {
        data: this.energyData.map(item => item.Low),
        label: 'Low Price',
        backgroundColor: this.energyData.map(item => this.getBarColors(item.Low)) // Apply color based on value
      }
    ];
  
    // Similar logic for other sectors (Agriculture, Metals, etc.)
    this.agricultureLabels = this.agricultureData.map(item => item.Name);
    this.agricultureChartData = [
      
      {
        data: this.agricultureData.map(item => item.High),
        label: 'High Price',
        backgroundColor: this.agricultureData.map(item => this.getBarColor(item.High))
      },
      {
        data: this.agricultureData.map(item => item.Low),
        label: 'Low Price',
        backgroundColor: this.agricultureData.map(item => this.getBarColors(item.Low))
      }
    ];
  
    this.metalsLabels = this.metalsData.map(item => item.Name);
    this.metalsChartData = [
      
      {
        data: this.metalsData.map(item => item.High),
        label: 'High Price',
        backgroundColor: this.metalsData.map(item => this.getBarColor(item.High))
      },
      {
        data: this.metalsData.map(item => item.Low),
        label: 'Low Price',
        backgroundColor: this.metalsData.map(item => this.getBarColors(item.Low))
      }
    ];
  }
  
  // Function to determine the bar color
  getBarColor(value: number): string {
    return value >= 0 ? '#1abc9c' : '#34495e'; // Green for high, Red for low
  }
  getBarColors(value: number): string {
    return value >= 0 ? '#34495e' : '#1abc9c'; // Green for high, Red for low
  }

  selectTab(tab: number) {
    this.selectedTab = tab;
  }

    // Fetch the watchlist from the database
  fetchWatchlist() {
    this.userService.getWatchlist(this.email).subscribe(
      response => {
        console.log('Fetched watchlist:', response); // Debugging line
        const fullWatchlist = response.watchlist || [];
        // Filter the watchlist to only include items with type 'com'
        this.watchlist = fullWatchlist.filter(item => item.type === 'com');
        this.filterUnstoredcoms(); // Refresh the unstored coms list after fetching watchlist
      },
      error => {
        console.error('Error fetching watchlist:', error);
      }
    );
  }

  // Load the available commodities from the database
  loadAvailablecoms() {
    this.commodityService.getCommodities().subscribe(
      (coms: any[]) => {
        this.availablecoms = coms; // No need to access 'response.data' if 'coms' are sent directly
        console.log('Available coms:', this.availablecoms);
        this.filterUnstoredcoms(); // Apply any additional filtering logic you have
      },
      (error: any) => {
        console.error('Error fetching available coms:', error);
      }
    );
  }

  // Filter out commodities that are already in the watchlist
  filterUnstoredcoms() {
    this.unstoredcoms = this.availablecoms.filter(com =>
      !this.watchlist.some(w => w.symbol === com.Symbol)
    );

    if (this.filterText) {
      this.filteredUnstoredcoms = this.unstoredcoms.filter(com =>
        com.Symbol.toLowerCase().includes(this.filterText.toLowerCase())
      );
    } else {
      this.filteredUnstoredcoms = [...this.unstoredcoms];
    }
  }

  // Add a commodity to the watchlist
  onAddcom(com: any) {
    if (!this.iscomInWatchlist(com)) {
      const newcom = {
        symbol: com.Symbol,
        open: com.Data[0].Open,
        high: com.Data[0].High,
        low: com.Data[0].Low,
        close: com.Data[0].Close,
        bid: com.Data[0].Bid,
        ask: com.Data[0].Ask,
        type: 'com'
      };

      // Add the new item directly to the watchlist array
      this.watchlist.push(newcom);

      // Save the updated watchlist to the database
      this.userService.addToWatchlist(this.email, [newcom]).subscribe(
        response => {
          console.log('com added to watchlist successfully');
          this.filterUnstoredcoms(); // Refresh the unstored coms list
        },
        error => {
          console.error('Error adding com to watchlist:', error);
        }
      );
    }
  }

  onDeletecom(Data: any) {
    // Remove the item from the local watchlist array
    this.watchlist = this.watchlist.filter(s => s.symbol !== Data.symbol);

    // Call the backend to remove the item from the database
    this.userService.removeFromWatchlist(this.email, Data.symbol).subscribe(
      response => {
        console.log('Forex removed from watchlist successfully');
        this.filterUnstoredcoms(); // Refresh the unstored forex list
      },
      error => {
        console.error('Error removing forex from watchlist:', error);
      }
    );
  }
 
  // Check if a commodity is already in the watchlist
  iscomInWatchlist(com: any): boolean {
    return this.watchlist.some(s => s.symbol === com.Symbol);
  }
}