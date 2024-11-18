import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { UserService } from '../../services/user.service';
import { ChartType, ChartOptions } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  searchQuery: string = '';
  news: any[] = [];
  activeNews: any[] = [];
  archivedNews: any[] = [];
  defaultImage: string = '../../../assets/g4.jpg';
  currentSortProperty: string = 'title';
  currentSortOrder: string = 'asc';
  archivedArticles: any[] = [];
  pagedActiveNews: any[] = [];
  pagedArchivedNews: any[] = [];
  activeCurrentPage: number = 1;
  archivedCurrentPage: number = 1;
  itemsPerPage: number = 10;
  mainUrls: string[] = [];
  selectedSites: Set<string> = new Set();
  showPopup: boolean = false;

  manualUrl: string = '';
  summaryData: any = null;
  errorMessage: string = '';
  loading: boolean = false;
  contentUnavailable: boolean = false;

  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  public pieChartLabels: Label[] = ['Positive Sentiment', 'Negative Sentiment'];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [];
  pieChartColors: { backgroundColor: string[]; }[];

  constructor(private newsService: NewsService,private userService: UserService, private http: HttpClient) { }

  ngOnInit() {
    this.loadNews();
     this.fetchArchivedArticles();
  }

  onImageError(article: any) {
    article.imageUrl = this.defaultImage;
  }


  summarizeManualUrl() {
    if (!this.manualUrl) {
      this.errorMessage = "Please enter a valid URL.";
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.summaryData = null;
    this.contentUnavailable = false;

    this.http.post('http://localhost:3000/api/news/summarize-url', { url: this.manualUrl.trim() })
      .subscribe(
        (response: any) => {
          this.loading = false;
          console.log(response);

          if (response.message === 'Content behind a paywall or unavailable.') {
            this.contentUnavailable = true;
          } else {
            this.summaryData = response;
          }
        },
        (error) => {
          this.loading = false;
          console.error('Error:', error);
          this.errorMessage = 'Error fetching the content. Please try again.';
        }
      );
  }

  loadNews() {
    this.newsService.getAllNews().subscribe(
      (data: any) => {
        this.news = data.sort((a, b) => a.z - b.z).reverse();
        this.news.forEach(article => {
          console.log('Headline:', article.headline, 'Sentiment Score:', article.sentimentScore);
        });
        this.filterNews();
        this.updatePagedNews();
        this.populateMainUrls();
        this.prepareChartData();
      },
      error => {
        console.error(error);
      }
    );
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  filterNews() {
    this.activeNews = this.news.filter(article => !article.archive);
    this.archivedNews = this.news.filter(article => article.archive);
  }

  applySearchFilter() {
    if (this.searchQuery.trim() === '') {
      this.filterNewsBySelectedSites();
    } else {
      const searchRegex = new RegExp(this.searchQuery.trim(), 'i');
      this.activeNews = this.news.filter(article =>
        !article.archive && (searchRegex.test(article.headline) || searchRegex.test(article.summary)) &&
        (this.selectedSites.size === 0 || this.selectedSites.has(new URL(article.url).hostname))
      );
      this.archivedNews = this.news.filter(article =>
        article.archive && (searchRegex.test(article.headline) || searchRegex.test(article.summary)) &&
        (this.selectedSites.size === 0 || this.selectedSites.has(new URL(article.url).hostname))
      );
    }

    this.updatePagedNews();
  }

  filterNewsBySelectedSites() {
    if (this.selectedSites.size === 0) {
      this.activeNews = this.news.filter(article => !article.archive);
      this.archivedNews = this.news.filter(article => article.archive);
    } else {
      this.activeNews = this.news.filter(article =>
        !article.archive && this.selectedSites.has(this.getSiteName(article.url))
      );
      this.archivedNews = this.news.filter(article =>
        article.archive && this.selectedSites.has(this.getSiteName(article.url))
      );
    }
    this.updatePagedNews();
  }

  populateMainUrls() {
    this.mainUrls = Array.from(new Set(this.news.map(article => this.getSiteName(article.url))));
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
  
   
  activePageRange(): number[] {
    const numPagesToShow = 5;
    const currentPage = this.activeCurrentPage;
    const totalPages = this.activeTotalPagesArray().length;
    const halfPagesToShow = Math.floor(numPagesToShow / 2);

    let startPage: number;
    let endPage: number;

    if (totalPages <= numPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage - halfPagesToShow <= 0) {
      startPage = 1;
      endPage = numPagesToShow;
    } else if (currentPage + halfPagesToShow >= totalPages) {
      startPage = totalPages - numPagesToShow + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - halfPagesToShow;
      endPage = currentPage + halfPagesToShow;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  activeTotalPagesArray(): number[] {
    const totalPages = Math.ceil(this.activeNews.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  archivedPageRange(): number[] {
    const numPagesToShow = 5;
    const currentPage = this.archivedCurrentPage;
    const totalPages = this.archivedTotalPagesArray().length;
    const halfPagesToShow = Math.floor(numPagesToShow / 2);

    let startPage: number;
    let endPage: number;

    if (totalPages <= numPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage - halfPagesToShow <= 0) {
      startPage = 1;
      endPage = numPagesToShow;
    } else if (currentPage + halfPagesToShow >= totalPages) {
      startPage = totalPages - numPagesToShow + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - halfPagesToShow;
      endPage = currentPage + halfPagesToShow;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  archivedTotalPagesArray(): number[] {
    const totalPages = Math.ceil(this.archivedNews.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  // prepareChartData() {
  //   const positiveSentiments = this.news.filter(article => article.sentimentScore > 0).length;
  //   const negativeSentiments = this.news.filter(article => article.sentimentScore < 0).length;

  //   this.pieChartData = [positiveSentiments, negativeSentiments];
  // }


  toggleSummary(article) {
    article.showFullSummary = !article.showFullSummary;
  }

  sortActiveNews(property: string) {
    // Toggle sort order if the same property is selected
    if (this.currentSortProperty === property) {
      this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortOrder = 'asc'; // Default to ascending order
    }
  
    this.currentSortProperty = property;
  
    this.activeNews.sort((a, b) => {
      let comparison = 0;

      if (property === 'title') {
        const titleA = a.headline.toLowerCase();
        const titleB = b.headline.toLowerCase();
        comparison = titleA.localeCompare(titleB);
      } else if (property === 'sentimentScore') {
        comparison = a.sentimentScore - b.sentimentScore;
      } else if (property === 'articleDateTime') {
        const dateA = this.parseDate(a.articleDateTime);
        const dateB = this.parseDate(b.articleDateTime);
        comparison = dateA.getTime() - dateB.getTime();
      }

      return this.currentSortOrder === 'asc' ? comparison : -comparison;
    });

    this.updatePagedNews();
  }

   parseDate(dateString: string): Date {
  // Example date format: "26/8/2024, 7:08:00 pm"
  const [datePart, timePart] = dateString.split(', ');

  if (!datePart || !timePart) {
    console.error('Invalid date string format:', dateString);
    return new Date(); // Return a default date or handle the error appropriately
  }

  // Split the date part into day, month, and year
  const [day, month, year] = datePart.split('/').map(Number);

  // Split the time part into hour, minute, second, and meridian
  const [time, meridian] = timePart.split(' ');
  const [hour, minute, second] = time.split(':').map(Number);

  // Validate the meridian
  const meridianLower = (meridian || '').toLowerCase(); // Default to an empty string if meridian is undefined

  // Adjust hour based on meridian
  let adjustedHour = hour;
  if (meridianLower === 'pm' && hour < 12) {
    adjustedHour += 12;
  }
  if (meridianLower === 'am' && hour === 12) {
    adjustedHour = 0;
  }

  // Return a new Date object
  return new Date(year, month - 1, day, adjustedHour, minute, second);
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
    const positiveCount = this.news.filter(article => article.sentimentScore > 0).length;
    const negativeCount = this.news.filter(article => article.sentimentScore < 4).length;
  
    this.pieChartData = [positiveCount, negativeCount];
    this.pieChartLabels = ['Positive', 'Negative'];
    this.pieChartColors = [
      {
        backgroundColor: ['#987D9A', '#EECEB9'], // Green for positive, Red for negative
      },
    ];
  
    console.log('Positive Count:', positiveCount, 'Negative Count:', negativeCount); // Debug log
  }

  fetchArchivedArticles() {
    const email = this.userService.getEmail(); // Get email from the UserService
    this.userService.getArchivedArticles(email).subscribe(
      (data) => {
        this.archivedArticles = data; // Store the fetched articles
      },
      (error) => {
        console.error('Error fetching archived articles:', error);
      }
    );
  }

  archiveArticle(article) {
    const archivedArticle = {
      id: article._id,
      headline: article.headline,
      summary: article.summary,
      sentimentScore: article.sentimentScore,
      sentiment: article.sentiment,
      articleDateTime: article.articleDateTime,
      imageUrl: article.imageUrl || 'defaultImage' // Fallback image if none provided
    };

    // Call the UserService method to archive the article for the user
    this.userService.archiveArticle(this.userService.getEmail(), archivedArticle).subscribe(() => {
      article.archive = true; // Mark the article as archived in the UI
      this.filterNews(); // Call your method to filter the news
      this.updatePagedNews(); // Call your method to update the paged news
      this.prepareChartData(); // Call your method to prepare chart data
    });

    this.newsService.archiveNews(article._id).subscribe(() => {
       article.archive = true;
       
    });
  }
 
}
