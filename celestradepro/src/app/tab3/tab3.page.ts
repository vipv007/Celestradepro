import { Component, OnInit, ViewChild } from '@angular/core';
import { ForexService } from '../services/forex.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { GainerService } from 'src/app/services/gainer.service';
import { FrxindexService } from '../services/frxindex.service';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import Chart from 'chart.js';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page  {

  forexs: any[] = [];
  selectTabs = 'recent';
  sortOrder: string = ''; 
  searchTerm: string = '';
  selectedForex: any;
  clickedForex: string;
  someValue: number;
  selectedTabs: string = 'recent';
  selectedTab: number = 1;
  tabs = [
    { key: 'gainer', label: 'Top Gainer' },
    { key: 'loser', label: 'Top Loser' },
   // { key: 'watchlist', label: 'Watchlist' }
  ];
  
  
  frxindexData: any;
  
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

  email: string = '';
  isLoggedIn: boolean = false;
  watchlist: any[] = [];
  availableforexs: any[] = [];
  unstoredforexs: any[] = [];
  filteredUnstoredforexs: any[] = [];
  filterText: string = '';

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

  public selectedTimeframe = '1 Day';
  private technicals: any = {};
  topGainers: any;
  topLosers: any;
  constructor(private forexService: ForexService, private router: Router,private gainerService: GainerService,
    private userService: UserService, private frxindexService: FrxindexService) {}

    

   ngOnInit(): void  {

      this.email = this.userService.getEmail(); // Get the email from the service
    if (this.email) {
      this.fetchWatchlist();
    } else {
      this.loadAvailableforexs();
      console.error('No email found, please login first.');
    }

    this.openTab(null, 'watchlist');
    this.getTopGainersAndLosers();
    this.fetchWatchlist();
    this.loadAvailableforexs();
    this.fetchTechnical();    this.someValue = 0; // Initialize with a default value
    }

    
activeContent: string = 'INTEREST AND RATES'; // Initially no content is active


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

setClickedForex(symbol: string) {
    this.clickedForex = symbol;
    console.log('Clicked Forex:', this.clickedForex);
    this.selectTabs = 'missed';
    this.router.navigate(['/celestradepro/Forex'], { queryParams: { symbol } });
  }

selectTab(tabKey: number) {
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
  
  // Define variables to store the selected view for gainer and loser
viewGainer: 'chart' | 'table' = 'chart';
viewLoser: 'chart' | 'table' = 'chart';


// Fetch top gainers and losers
getTopGainersAndLosers(): void {
  this.gainerService.getTopGainersAndLosers().subscribe(
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

  fetchTechnical(): void {
    this.frxindexService.getFrxindexs().subscribe((response: any) => {
      console.log('API Response:', response); // Log the response to check the structure

      if (response && response.length > 0) {
        // Access the first object in the array
        const data = response[0];

        this.technicals = data;

        // Extract sectors from one of the time periods, e.g., `1_week`
        this.barChartLabels = Object.keys(data['1_week']); // Assuming all periods have the same sectors

        // Initialize the chart data
        this.updateChartData(data);
      } else {
        console.error('Data not found in the response.');
      }
    });
  }

  updateChart(timeframe: string): void {
    this.selectedTimeframe = timeframe;
    this.updateChartData(this.technicals); // Pass the fetched technical data
  }

  updateChartData(performanceData: any): void {
    // Mapping MongoDB fields to the corresponding timeframes
    const timeframeMapping: any = {
      '1 Day': 'days',
      '1 Week': '1_week',
      '1 Month': '1_month',
      '3 Months': '3_months'
    };

    const timeframeKey = timeframeMapping[this.selectedTimeframe];
    const timeframeData = performanceData[timeframeKey];

    if (timeframeData) {
      const sectorValues = Object.values(timeframeData); // Extract the performance values

      this.barChartData = [
        { data: sectorValues, label: this.selectedTimeframe + ' Performance' }
      ];

      // Update colors based on positive/negative values
      this.barChartColors = [
        {
          backgroundColor: sectorValues.map((value: number) => 
            value >= 0 ? '#4CAF50' : '#F44336'
          )
        }
      ];
    } else {
      console.error(`No data available for the selected timeframe: ${this.selectedTimeframe}`);
      // Handle the case where data is missing or incorrect
    }
  }



  fetchWatchlist() {
    this.userService.getWatchlist(this.email).subscribe(
      response => {
        console.log('Fetched watchlist:', response); // Debugging line
        const fullWatchlist = response.watchlist || [];
        // Filter the watchlist to only include items with type 'stock'
        this.watchlist = fullWatchlist.filter(item => item.type === 'forex');
        this.filterUnstoredforexs(); // Refresh the unstored forexs list after fetching watchlist
      },
      error => {
        console.error('Error fetching watchlist:', error);
      }
    );
  }
  

  loadAvailableforexs(){
    this.forexService.getAllForexs().subscribe(
      (forexs: any[]) => {
        this.availableforexs = forexs; // No need to access 'response.data' if 'forexs' are sent directly
        console.log('Available Forexs:', this.availableforexs);
        this.filterUnstoredforexs(); // Apply any additional filtering logic you have
      },
      (error: any) => {
        console.error('Error fetching available forexs:', error);
      }
    );
  }
  

  filterUnstoredforexs() {
    this.unstoredforexs = this.availableforexs.filter(forex => 
      !this.watchlist.some(w => w.symbol === forex.symbol)
    );

    if (this.filterText) {
      this.filteredUnstoredforexs = this.unstoredforexs.filter(forex =>
        forex.symbol.toLowerCase().includes(this.filterText.toLowerCase())
      );
    } else {
      this.filteredUnstoredforexs = [...this.unstoredforexs];
    }
  }

  onAddforex(forex: any) {
    if (!this.isforexInWatchlist(forex)) {
      const newforex = {
        symbol: forex.symbol,
        open: forex.values[0].Open,
        high: forex.values[0].High,
        low: forex.values[0].Low,
        close:forex.values[0].Close,
        bid: forex.values[0].Bid,
        ask: forex.values[0].Ask,
        type: 'forex'
      };
  
      this.watchlist.push(newforex);
      this.userService.addToWatchlist(this.email, this.watchlist).subscribe(
        response => {
          console.log('forex added to watchlist successfully');
          this.filterUnstoredforexs(); // Refresh the unstored forexs list
        },
        error => {
          console.error('Error adding forex to watchlist:', error);
        }
      );
    }
  }
  
  onDeleteforex(values: any) {
    // Remove the item from the local watchlist array
    this.watchlist = this.watchlist.filter(s => s.symbol !== values.symbol);

    // Call the backend to remove the item from the database
    this.userService.removeFromWatchlist(this.email, values.symbol).subscribe(
      response => {
        console.log('Forex removed from watchlist successfully');
        this.filterUnstoredforexs(); // Refresh the unstored forex list
      },
      error => {
        console.error('Error removing forex from watchlist:', error);
      }
    );
  }


  isforexInWatchlist(values: any): boolean {
    return this.watchlist.some(s => s.symbol === values.symbol);
  }
}