import { Component, OnInit } from '@angular/core';
import { Com_newsService } from '../../services/com_news.service';
import { ChartType, ChartOptions } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-com-news',
  templateUrl: './com-news.component.html',
  styleUrls: ['./com-news.component.scss'],
})
export class ComNewsComponent implements OnInit {
  com_news: any[] = [];
  activeNews: any[] = [];
  archivedNews: any[] = [];
  searchQuery: string = '';
  pagedActiveNews: any[] = [];
  pagedArchivedNews: any[] = [];
  activeCurrentPage: number = 1;
  archivedCurrentPage: number = 1;
  itemsPerPage: number = 10;
  currentSortProperty: string = 'title'; // Default sorting property
  currentSortOrder: string = 'asc'; // Default sorting order
  mainUrls: string[] = [];
  showPopup: boolean = false;
   archivedArticlescom: any[] = [];
  manualUrl: string = '';
  summaryData: any = null;
  errorMessage: string = '';
  loading: boolean = false;
  contentUnavailable: boolean = false;

  selectedSites: Set<string> = new Set();


  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  public pieChartLabels: Label[] = ['Positive Sentiment', 'Negative Sentiment', 'Neutral Sentiment'];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [];
  pieChartColors: { backgroundColor: string[]; }[] = [
    {
      backgroundColor: ['#987D9A', '#EECEB9', '#B0BEC5'],
    },
  ];
  constructor(private com_newsService: Com_newsService, private userService: UserService, private http: HttpClient) { }

  ngOnInit() {
    this.loadNews();
    this.fetchArchivedArticles();
  }

  loadNews() {
    this.com_newsService.getCom_news().subscribe(
      (data: any) => {
        this.com_news = data.sort((a, b) => a.z - b.z).reverse();
        this.populateMainUrls();
        this.filterNews(); // Ensure the initial filter is applied
        this.updatePagedNews();
        this.prepareChartData();
      },
      error => {
        console.error(error);
      }
    );
  }

  comSummarizeUrl() {
    // Check if manualUrl is provided
    if (!this.manualUrl) {
      this.errorMessage = "Please enter a valid URL.";
      return;
    }

    // Set loading state and clear previous messages
    this.loading = true;
    this.errorMessage = '';
    this.summaryData = null;
    this.contentUnavailable = false;

    // Prepare the POST request to the API
    const apiUrl = 'http://localhost:3000/comnews/com-summarize-url';
    const requestBody = { url: this.manualUrl.trim() };

    // Make the HTTP POST request
    this.http.post(apiUrl, requestBody).subscribe(
      (response: any) => {
        this.loading = false; // Stop loading indicator
        console.log(response); // Log the response for debugging

        // Check the response message for content availability
        if (response.message === 'Content is behind a paywall.') {
          this.contentUnavailable = true;
        } else {
          this.summaryData = response; // Assign the summary data to the variable
        }
      },
      (error) => {
        this.loading = false; // Stop loading indicator
        console.error('Error:', error); // Log error for debugging
        this.errorMessage = 'Error fetching the content. Please try again.'; // Show error message
      }
    );
  }




  filterNewsBySelectedSites() {
    if (this.selectedSites.size === 0) {
      this.activeNews = this.com_news.filter(article => !article.archive);
      this.archivedNews = this.com_news.filter(article => article.archive);
    } else {
      this.activeNews = this.com_news.filter(article =>
        !article.archive && this.selectedSites.has(this.getSiteName(article.url))
      );
      this.archivedNews = this.com_news.filter(article =>
        article.archive && this.selectedSites.has(this.getSiteName(article.url))
      );
    }
    this.updatePagedNews();
  }
  populateMainUrls() {
    this.mainUrls = Array.from(new Set(this.com_news.map(article => this.getSiteName(article.url))));
  }
  
  toggleSiteSelection(mainUrl: string) {
    if (this.selectedSites.has(mainUrl)) {
      this.selectedSites.delete(mainUrl);
    } else {
      this.selectedSites.add(mainUrl);
    }
    this.filterNewsBySelectedSites();
  }

  isSiteSelected(mainUrl: string): boolean {
    return this.selectedSites.has(mainUrl);
  }
  
  getSiteName(url: string): string {
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      const siteName = hostname.split('.')[0]; // Gets the domain name part
      return siteName.charAt(0).toUpperCase() + siteName.slice(1); // Capitalize the first letter
    } catch (e) {
      console.error('Invalid URL:', url);
      return 'Unknown';
    }
  }

  
  onCheckboxChange(site: string, isChecked: boolean) {
    this.selectedSites[site] = isChecked;
    this.filterNews();
  }



  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  filterByUrl(selectedHostname: string) {
    this.togglePopup(); // Close the popup
    this.activeNews = this.com_news.filter(article => 
      !article.archive && new URL(article.url).hostname === selectedHostname
    );
    this.archivedNews = this.com_news.filter(article => 
      article.archive && new URL(article.url).hostname === selectedHostname
    );
    this.updatePagedNews();
  }

  filterNews() {
    this.activeNews = this.com_news.filter(article => !article.archive);
    this.archivedNews = this.com_news.filter(article => article.archive);
  }

  applySearchFilter() {
    if (this.searchQuery.trim() === '') {
      this.filterNews();
    } else {
      const searchRegex = new RegExp(this.searchQuery.trim(), 'i'); // Case insensitive search
      this.activeNews = this.com_news.filter(article => 
        !article.archive && (searchRegex.test(article.headline) || searchRegex.test(article.summary))
      );
      this.archivedNews = this.com_news.filter(article => 
        article.archive && (searchRegex.test(article.headline) || searchRegex.test(article.summary))
      );
    }
    this.updatePagedNews();
  }

  updatePagedNews() {
    const startIndexActive = (this.activeCurrentPage - 1) * this.itemsPerPage;
    const endIndexActive = Math.min(startIndexActive + this.itemsPerPage, this.activeNews.length);
    this.pagedActiveNews = this.activeNews.slice(startIndexActive, endIndexActive);

    const startIndexArchived = (this.archivedCurrentPage - 1) * this.itemsPerPage;
    const endIndexArchived = Math.min(startIndexArchived + this.itemsPerPage, this.archivedNews.length);
    this.pagedArchivedNews = this.archivedNews.slice(startIndexArchived, endIndexArchived);
  }

  onActivePageChange(pageNumber: number) {
    this.activeCurrentPage = pageNumber;
    this.updatePagedNews();
  }

  onArchivedPageChange(pageNumber: number) {
    this.archivedCurrentPage = pageNumber;
    this.updatePagedNews();
  }

  // archiveArticle(article: any) {
  //   this.com_newsService.archiveCom_news(article._id).subscribe(() => {
  //     article.archive = true;
  //     this.filterNews();
  //     this.updatePagedNews();
  //     this.prepareChartData();
  //   });
  // }

   archiveArticle(article) {
    const archivedArticlecom = {
      id: article._id,
      headline: article.headline,
      summary: article.summary,
      sentimentScore: article.sentimentScore,
      sentiment: article.sentiment,
      articleDateTime: article.articleDateTime,
      imageUrl: article.imageUrl || 'defaultImage' // Fallback image if none provided
    };

    // Call the UserService method to archive the article for the user
    this.userService.archiveArticlecom(this.userService.getEmail(), archivedArticlecom).subscribe(() => {
      article.archive = true; // Mark the article as archived in the UI
      this.filterNews(); // Call your method to filter the news
      this.updatePagedNews(); // Call your method to update the paged news
      
    });
     
    this.com_newsService.archiveCom_news(article._id).subscribe(() => {
       article.archive = true;
       
    });
  }

  fetchArchivedArticles() {
    const email = this.userService.getEmail(); // Get email from the UserService
    this.userService.getArchivedArticlescom(email).subscribe(
    (data) => {
      console.log('Fetched data:', data); // Check the structure of the data
    this.archivedArticlescom = data;
    },
    (error) => {
      console.error('Error fetching archived articles:', error);
    }
  );
  }

  activeTotalPagesArray(): number[] {
    const totalPages = Math.ceil(this.activeNews.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  archivedTotalPagesArray(): number[] {
    const totalPages = Math.ceil(this.archivedNews.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  toggleSummary(article: any) {
    article.showFullSummary = !article.showFullSummary;
  }

  sortActiveNews(property: string) {
  if (this.currentSortProperty === property) {
    this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    this.currentSortOrder = 'asc';
  }
  this.currentSortProperty = property;

  this.activeNews.sort((a, b) => {
    let comparison = 0;

    if (property === 'title') {
      const titleA = a.headline?.toLowerCase() || '';
      const titleB = b.headline?.toLowerCase() || '';
      comparison = titleA.localeCompare(titleB);
    } else if (property === 'sentimentScore') {
      const sentimentA = a.sentimentScore ?? 0;
      const sentimentB = b.sentimentScore ?? 0;
      comparison = sentimentA - sentimentB;
    } else if (property === 'fetchedTime') {
      const dateA = a[property];
      const dateB = b[property];

      if (!dateA || !dateB) {
        console.error(`Invalid date format: ${dateA || 'undefined'} or ${dateB || 'undefined'}`);
        return dateA ? -1 : 1;
      }

      const parsedDateA = new Date(dateA);
      const parsedDateB = new Date(dateB);

      if (isNaN(parsedDateA.getTime())) {
        console.error(`Invalid date format: ${dateA}`);
        return 1;  // Move invalid dates to the end
      }

      if (isNaN(parsedDateB.getTime())) {
        console.error(`Invalid date format: ${dateB}`);
        return -1;  // Move invalid dates to the end
      }

      comparison = parsedDateA.getTime() - parsedDateB.getTime();
    }

    return this.currentSortOrder === 'asc' ? comparison : -comparison;
  });

  this.updatePagedNews();
}


  defaultSortSymbol(property: string): string {
    switch (property) {
      case 'title':
        return this.currentSortProperty === 'title' ? (this.currentSortOrder === 'asc' ? '↑↓' : '↓↑') : '↓↑';
      case 'sentimentScore':
        return this.currentSortProperty === 'sentimentScore' ? (this.currentSortOrder === 'asc' ? '↑↓' : '↓↑') : '↓↑';
      case 'articleDateTime':
        return this.currentSortProperty === 'articleDateTime' ? (this.currentSortOrder === 'asc' ? '↑↓' : '↓↑') : '↓↑';
      default:
        return '';
    }
  }

  prepareChartData() {
    const positiveCount = this.com_news.filter(article => article.sentimentScore > 0).length;
    const negativeCount = this.com_news.filter(article => article.sentimentScore < 3).length;
    const neutralCount = this.com_news.filter(article => article.sentimentScore === 0 || article.sentimentScore == null).length;

    this.pieChartData = [positiveCount, negativeCount, neutralCount];
    this.pieChartLabels = ['Positive', 'Negative', 'N/A'];
    this.pieChartColors = [
      {
        backgroundColor: ['#E68369', '#80AF81', '#B0BEC5'], // Colors for positive, negative, and neutral
      },
    ];

    console.log('Positive Count:', positiveCount, 'Negative Count:', negativeCount, 'Neutral (N/A) Count:', neutralCount); // Debug log
  }
}
