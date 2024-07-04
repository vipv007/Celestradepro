// optionnews.component.ts (Angular component)
import { Component, OnInit } from '@angular/core';
import { OptionnewsService } from '../../services/optionnews.service';

@Component({
  selector: 'app-optionnews',
  templateUrl: './optionnews.component.html',
  styleUrls: ['./optionnews.component.scss'],
})
export class OptionnewsComponent implements OnInit {

  optionnews: any[] = [];
  activeNews: any[] = [];
  archivedNews: any[] = [];
  searchQuery: string = '';
  pagedActiveNews: any[] = [];
  pagedArchivedNews: any[] = [];
  activeCurrentPage: number = 1;
  archivedCurrentPage: number = 1;
  itemsPerPage: number = 10;
  currentSortProperty: string = 'title';
  currentSortOrder: string = 'asc';
  mainUrls: string[] = [];
  showPopup: boolean;

  constructor(private optionnewsService: OptionnewsService) { }

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.optionnewsService.getOptionnews().subscribe(
      (data: any[]) => {
        this.optionnews = data;
        this.optionnews.reverse(); // Optionally reverse sorting if needed
        this.filterNews();
        this.updatePagedNews();
        this.populateMainUrls();
      },
      error => {
        console.log(error);
      }
    );
  }

  populateMainUrls() {
    this.mainUrls = Array.from(new Set(this.optionnews.map(article => new URL(article.url).hostname)));
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  filterNewsByMainUrl(mainUrl: string) {
    this.searchQuery = '';
    this.activeNews = this.optionnews.filter(
      article => !article.archive && new URL(article.url).hostname === mainUrl
    );
    this.archivedNews = this.optionnews.filter(
      article => article.archive && new URL(article.url).hostname === mainUrl
    );
    this.updatePagedNews();
  }

  filterNews() {
    this.activeNews = this.optionnews.filter(article => !article.archive);
    this.archivedNews = this.optionnews.filter(article => article.archive);
  }

  applySearchFilter() {
    if (this.searchQuery.trim() === '') {
      this.activeNews = this.optionnews.filter(article => !article.archive);
      this.archivedNews = this.optionnews.filter(article => article.archive);
    } else {
      const searchRegex = new RegExp(this.searchQuery.trim(), 'i');
      this.activeNews = this.optionnews.filter(article =>
        !article.archive && (searchRegex.test(article.headline) || searchRegex.test(article.summary))
      );
      this.archivedNews = this.optionnews.filter(article =>
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
    this.optionnewsService.archiveOptionnews(article._id).subscribe(() => {
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
