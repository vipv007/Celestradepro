import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from '../services/news.service';
import { StockGainerService } from '../services/stockgainer.service';
import { UserService } from '../services/user.service';
import { OptionnewsService } from '../services/optionnews.service'; 
import { Com_newsService } from '../services/com_news.service';
import { StockService } from '../services/stock.service';
import { ForexService } from '../services/forex.service';
import { CommodityService } from '../services/commodity.service';

@Component({
  selector: 'app-crt',
  templateUrl: './crt.page.html',
  styleUrls: ['./crt.page.scss'],
})
export class CrtPage implements OnInit {
  topGainers: any[] = [];
  topLosers: any[] = [];
  topSentiments: any[] = [];
  optionNews: any[] = [];
  forexStocks: any[] = [];
  commodityNews: any[] = [];
  pagedCommodityNews: any[] = [];
  selectedStocks: any[] = [];
  stocks: any[] = [];
  commodities: any[] = []; 
  forexData: any[] = [];  // Store all Forex data here
  selectedForexStocks: any[] = [];  // To store and display only two Forex items

  isLoginOpen = false;
  isLoggedIn = false;
  email: string = '';
  isDarkMode: boolean = false;
  isSettingsOpen = false;

  selectTabs: string = 'recent'; // Default tab value
  activeContent: string = ''; // Default active content

  allSections = [
    { name: 'Top Market News', visible: true },
    { name: 'Top Stories', visible: true },
    { name: 'Top Gainers', visible: true },
    { name: 'Top Losers', visible: true },
    { name: 'Most Events', visible: true },
    { name: 'Trending stocks', visible: true },
    { name: 'Ecalendar', visible: true },
    { name: 'Fx Hours', visible: true },
  ];

  sections = [...this.allSections];

  constructor(
    private newsService: NewsService,
    private stockgainerService: StockGainerService,
    private userService: UserService,
    private stockService: StockService,
    private com_newsService: Com_newsService,
    private forexService: ForexService,
    private optionnewsService: OptionnewsService, 
    private commodityService: CommodityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTopGainersAndLosers();
    this.fetchTopSentiments();
    this.checkLoginStatus();
    this.loadOptionNews();
    this.loadCommodityNews();
    this.getForexData();
    this.loadCommodities();
    
    // Load all stocks and select the first two for display
    this.stockService.getAllStocks().subscribe((response: any[]) => {
      this.stocks = response;
      this.selectedStocks = this.stocks.slice(0, 2);
    });

    
  }

  loadCommodities() {
    this.commodityService.getCommodities().subscribe(
      (data: any[]) => {
        this.commodities = data; // Store fetched data
      },
      error => {
        console.error('Error fetching commodities:', error);
      }
    );
  }

getForexData() {
  this.forexService.getAllForexs().subscribe(
    (data: any) => {
      console.log('Fetched Forex Data:', data);  // Log fetched data for debugging
      this.forexData = data;
      this.selectedForexStocks = this.forexData.slice(0, 2);  // Display the first two stocks
      console.log('Selected Forex Stocks:', this.selectedForexStocks);  // Log selected stocks
    },
    (error) => {
      console.error('Error fetching Forex data:', error);
    }
  );
}
  


  // Fetch Commodity News
  loadCommodityNews() {
    this.com_newsService.getCom_news().subscribe(
      (data: any) => {
        this.commodityNews = data.sort((a, b) => a.z - b.z).reverse();
      },
      error => {
        console.error(error);
      }
    );
  }

  // User Authentication and Preferences
  checkLoginStatus() {
    this.email = this.userService.getEmail();
    if (this.email) {
      this.isLoggedIn = true;
      this.loadUserPreferences();
    }
  }

  loadUserPreferences() {
    this.userService.getUserData(this.email).subscribe(
      (user: any) => {
        if (user && user.selectedSections) {
          this.sections = this.allSections.map(section => ({
            ...section,
            visible: user.selectedSections.includes(section.name)
          }));
        } else {
          this.sections = [...this.allSections];
          this.saveSectionPreferences();
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  saveSectionPreferences() {
    const visibleSections = this.sections
      .filter(section => section.visible)
      .map(section => section.name);

    this.userService.updateSelectedSections(this.email, visibleSections).subscribe(
      (response: any) => {
        console.log('Selected sections saved successfully');
      },
      (error) => {
        console.error('Error saving selected sections:', error);
      }
    );
  }
  onImageLoad(event: Event): void {
    console.log("Image loaded:", event);
    // You can perform any additional actions here
  }

  toggleLogin() {
    this.isLoginOpen = !this.isLoginOpen;
  }

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  // Login/Logout logic
  onLogin() {
    this.userService.storeEmail(this.email).subscribe(
      response => {
        this.isLoggedIn = true;
        this.isLoginOpen = false;
        this.userService.setEmail(this.email);
        this.loadUserPreferences();

        this.userService.getUserTheme(this.email).subscribe(
          (response: any) => {
            this.isDarkMode = response?.theme === 'dark';
            this.applyTheme(this.isDarkMode);
          },
          error => console.error('Error fetching theme:', error)
        );
      },
      error => console.error('Error storing email:', error)
    );
  }

  onLogout() {
    this.isLoggedIn = false;
    this.isLoginOpen = false;
    this.userService.setEmail('');
    this.sections = [...this.allSections];
    this.saveSectionPreferences();
  }

  // Theme management
  applyTheme(isDark: boolean) {
    document.body.classList.toggle('dark', isDark);
  }

  // Fetch top gainers and losers
  getTopGainersAndLosers(): void {
    this.stockgainerService.getGainersAndLosers().subscribe(
      data => {
        const halfLength = Math.floor(data.length / 2);
        this.topGainers = data.slice(0, halfLength);
        this.topLosers = data.slice(halfLength);
      },
      error => console.error('Error fetching top gainers and losers', error)
    );
  }

  // Fetch top sentiment scores
  fetchTopSentiments(): void {
    this.newsService.getTopSentimentScores().subscribe(data => {
      this.topSentiments = data;
    });
  }

  // Fetch option news
  loadOptionNews(): void {
    this.optionnewsService.getOptionnews().subscribe(
      (data) => {
        this.optionNews = data.filter(article => article.imageUrl?.trim() !== '');
      },
      error => console.error('Error fetching option news:', error)
    );
  }

  // Section visibility logic
  isSectionVisible(sectionName: string): boolean {
    const section = this.sections.find(sec => sec.name === sectionName);
    return section ? section.visible : false;
  }

  // Navigation methods
  navigateToTab1() {
    this.router.navigate(['/celestradepro/Stocks'], { queryParams: { segment: 'contacts', content: 'NEWS' } });
  }

  navigateToTab2() {
    this.router.navigate(['/celestradepro/Options'], { queryParams: { segment: 'contacts', content: 'NEWS' } });
  }

  navigateToTab3() {
    this.router.navigate(['/celestradepro/Futures'], { queryParams: { segment: 'contacts', content: 'NEWS' } });
  }

  navigateToGainer() {
    this.router.navigate(['/celestradepro/Stocks'], { queryParams: { segment: 'recent', content: 'gainer' } });
  }

  navigateToLoser() {
    this.router.navigate(['/celestradepro/Stocks'], { queryParams: { segment: 'recent', content: 'loser' } });
  }

  navigateToCalender() {
    this.router.navigate(['/celestradepro/Forex'], { queryParams: { segment: 'research', content: 'ECONOMIC CALENDAR' } });
  }
}
