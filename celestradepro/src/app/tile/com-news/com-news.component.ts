import { Component, OnInit } from '@angular/core';
import { Com_newsService } from '../../services/com_news.service';

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

  constructor(private com_newsService: Com_newsService) { }

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.com_newsService.getCom_news().subscribe(
      (data: any) => {
        this.com_news = data.sort((a, b) => a.z - b.z).reverse();
        this.populateMainUrls();
        this.filterNews(); // Ensure the initial filter is applied
        this.updatePagedNews();
      },
      error => {
        console.error(error);
      }
    );
  }

  populateMainUrls() {
    this.mainUrls = Array.from(new Set(this.com_news.map(article => new URL(article.url).hostname)));
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

  archiveArticle(article: any) {
    this.com_newsService.archiveCom_news(article._id).subscribe(() => {
      article.archive = true;
      this.filterNews();
      this.updatePagedNews();
    });
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
