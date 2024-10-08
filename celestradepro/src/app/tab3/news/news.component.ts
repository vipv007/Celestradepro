import { Component, OnInit } from '@angular/core';
import { ForexnewsService } from '../../services/forexnews.service';
import { ChartType, ChartOptions } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  searchQuery: string = '';
  news: any[] = [];
  activeNews: any[] = [];
  archivedNews: any[] = [];

  currentSortProperty: string = 'title'; // Default sorting property
  currentSortOrder: string = 'asc'; // Default sorting order

  pagedActiveNews: any[] = [];
  pagedArchivedNews: any[] = [];
  activeCurrentPage: number = 1;
  archivedCurrentPage: number = 1;
  itemsPerPage: number = 10;
   mainUrls: { name: string, selected: boolean }[] = []; // Updated type
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
  pieChartColors: { backgroundColor: string[]; }[] = [
    {
      backgroundColor: ['#987D9A', '#EECEB9'],
    },
  ];

  constructor(private forexnewsService: ForexnewsService, private http: HttpClient) {}

  ngOnInit() {
    this.loadNews();
  }

  fxSummarizeUrl() {
    if (!this.manualUrl) {
        this.errorMessage = "Please enter a valid URL.";
        return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.summaryData = null;
    this.contentUnavailable = false;

    this.http.post('http://localhost:3000/api/fnews/fx-summarize-url', { url: this.manualUrl.trim() })
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
    this.forexnewsService.getAllFnews().subscribe(
      (data: any) => {
        this.news = data.sort((a, b) => a.z - b.z);
        this.news.reverse();
        this.filterNews();
        this.updatePagedNews();
        this.populateMainUrls();
        this.prepareChartData();
      },
      error => {
        console.log(error);
      }
    );
  }

  populateMainUrls() {
    this.mainUrls = Array.from(
      new Set(
        this.news.map(article => this.extractSiteName(new URL(article.url).hostname))
      )
    ).map(siteName => ({ name: siteName, selected: false }));
  }

   extractSiteName(hostname: string): string {
    return hostname.replace(/^www\./, '').replace(/\.com$/, '');
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  filterNewsByMainUrl() {
   const selectedSites = this.mainUrls.filter(site => site.selected).map(site => site.name);

    if (selectedSites.length === 0) {
      this.filterNews(); // No sites selected, show all news
    } else {
      this.activeNews = this.news.filter(article =>
        !article.archive && selectedSites.includes(this.extractSiteName(new URL(article.url).hostname))
      );
      this.archivedNews = this.news.filter(article =>
        article.archive && selectedSites.includes(this.extractSiteName(new URL(article.url).hostname))
      );
    }
    this.updatePagedNews();
  }

  filterNews() {
    this.activeNews = this.news.filter(article => !article.archive);
    this.archivedNews = this.news.filter(article => article.archive);
  }

  applySearchFilter() {
    if (this.searchQuery.trim() === '') {
      this.activeNews = this.news.filter(article => !article.archive);
      this.archivedNews = this.news.filter(article => article.archive);
    } else {
      const searchRegex = new RegExp(this.searchQuery.trim(), 'i');
      this.activeNews = this.news.filter(
        article => !article.archive && (searchRegex.test(article.headline) || searchRegex.test(article.summary))
      );
      this.archivedNews = this.news.filter(
        article => article.archive && (searchRegex.test(article.headline) || searchRegex.test(article.summary))
      );
    }
    this.updatePagedNews();
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

  archiveArticle(article) {
    this.forexnewsService.archiveNews(article._id).subscribe(() => {
      article.archive = true;
      this.filterNews();
      this.updatePagedNews();
      this.prepareChartData();
    });
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

  archivedTotalPagesArray(): number[] {
    const totalPages = Math.ceil(this.archivedNews.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  toggleSummary(article) {
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
    const positiveCount = this.news.filter(article => article.sentimentScore > 0).length;
    const negativeCount = this.news.filter(article => article.sentimentScore < 5).length;

    this.pieChartData = [positiveCount, negativeCount];
    this.pieChartLabels = ['Positive', 'Negative'];
    this.pieChartColors = [
      {
        backgroundColor: ['#009FBD', '#ECCEAE'], // Colors for positive and negative
      },
    ];

    console.log('Positive Count:', positiveCount, 'Negative Count:', negativeCount); // Debug log
  }
}
