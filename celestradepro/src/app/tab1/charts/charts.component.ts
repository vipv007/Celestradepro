import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';

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


// Initialize default sorting property and order
currentSortProperty: string = 'title'; // Default sorting property
currentSortOrder: string = 'asc'; // Default sorting order

  pagedActiveNews: any[] = [];
  pagedArchivedNews: any[] = []; 
  activeCurrentPage: number = 1;
  archivedCurrentPage: number = 1;
  itemsPerPage: number = 10;
  mainUrls: string[] = [];
  showPopup: boolean;
  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.newsService.getAllNews().subscribe(
      (data: any) => {
        this.news = data.sort((a, b) => a.z - b.z);
        this.news.reverse();
        this.filterNews();
        this.updatePagedNews();
        // Populate mainUrls from the news data
        this.populateMainUrls();
      },
      error => {
        console.log(error);
      }
    );
  }

  // Method to populate mainUrls with unique hostnames from news URLs
  populateMainUrls() {
    this.mainUrls = Array.from(new Set(this.news.map(article => new URL(article.url).hostname)));
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }
  
  filterNewsByMainUrl(mainUrl: string) {
    this.searchQuery = '';  // Clear any existing search query
    this.activeNews = this.news.filter(
      (article) => !article.archive && new URL(article.url).hostname === mainUrl
    );
    this.archivedNews = this.news.filter(
      (article) => article.archive && new URL(article.url).hostname === mainUrl
    );
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
      this.activeNews = this.news.filter(article => 
        !article.archive && (searchRegex.test(article.headline) || searchRegex.test(article.summary))
      );
      this.archivedNews = this.news.filter(article => 
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

  archiveArticle(article) {
    this.newsService.archiveNews(article._id).subscribe(() => {
      article.archive = true;
      this.filterNews();
      this.updatePagedNews();
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
    // Check if the same property is clicked again to toggle sort order
    if (this.currentSortProperty === property) {
      this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // If a different property is clicked, reset sort order to 'asc'
      this.currentSortOrder = 'asc';
    }
    this.currentSortProperty = property;
  
    this.activeNews.sort((a, b) => {
      if (property === 'title') {
        const titleA = a.headline.toLowerCase();
        const titleB = b.headline.toLowerCase();
        return this.currentSortOrder === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      } else if (property === 'sentimentScore') {
        return this.currentSortOrder === 'asc' ? a.sentimentScore - b.sentimentScore : b.sentimentScore - a.sentimentScore;
      } else if (property === 'fetchedTime') {
        return this.currentSortOrder === 'asc' ? new Date(b.fetchedTime).getTime() - new Date(a.fetchedTime).getTime() : new Date(a.fetchedTime).getTime() - new Date(b.fetchedTime).getTime();
      }
      return 0;
    });
    this.updatePagedNews();
  }




// Determine default sorting symbol for a given property
defaultSortSymbol(property: string): string {
  switch (property) {
    case 'title':
      return this.currentSortProperty === 'title' ? (this.currentSortOrder === 'asc' ? '↑↓' : '↓↑') : '↓↑';
    case 'sentimentScore':
      return this.currentSortProperty === 'sentimentScore' ? (this.currentSortOrder === 'asc' ? '↑↓' : '↓↑') : '↓↑';
    case 'fetchedTime':
      return this.currentSortProperty === 'fetchedTime' ? (this.currentSortOrder === 'asc' ? '↑↓' : '↓↑') : '↓↑';
    default:
      return '';
  }
}


}