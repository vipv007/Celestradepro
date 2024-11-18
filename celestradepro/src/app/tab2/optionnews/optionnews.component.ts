import { Component, OnInit } from '@angular/core';
import { OptionnewsService } from '../../services/optionnews.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-optionnews',
  templateUrl: './optionnews.component.html',
  styleUrls: ['./optionnews.component.scss'],
})
export class OptionnewsComponent implements OnInit {

  errorMessage: string = '';
  loading: boolean = false;
  manualUrl: string = '';
  summaryData: any = null;
   contentUnavailable: boolean = false;
  optionnews: any[] = [];
  activeNews: any[] = [];
  archivedNews: any[] = [];
  searchQuery: string = '';
  pagedActiveNews: any[] = [];
  pagedArchivedNews: any[] = [];
  activeCurrentPage: number = 1;
  archivedCurrentPage: number = 1;
  itemsPerPage: number = 10;
   archivedArticlesop: any[] = [];
  currentSortProperty: string = 'title';
  currentSortOrder: string = 'asc';
  mainUrls: { name: string, selected: boolean }[] = []; // Updated type
  showPopup: boolean = false;
  defaultImage: string = '../../../assets/g4.jpg';
  constructor(private optionnewsService: OptionnewsService, private userService: UserService,private http: HttpClient) { }

  ngOnInit() {
    this.loadNews();
    this.fetchArchivedArticles();
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
 
  onImageError(article: any) {
    article.imageUrl = this.defaultImage;
  }

  populateMainUrls() {
    this.mainUrls = Array.from(new Set(this.optionnews.map(article => this.extractSiteName(new URL(article.url).hostname))))
                          .map(site => ({ name: site, selected: false }));
  }

  extractSiteName(hostname: string): string {
    // Remove 'www.' and '.com' if present
    return hostname.replace(/^www\./, '').replace(/\.com$/, '');
  }

  opSummarizeUrl() {
    if (!this.manualUrl) {
      this.errorMessage = "Please enter a valid URL.";
      return;
    }
  
    this.loading = true;
    this.errorMessage = '';
    this.summaryData = null;
    this.contentUnavailable = false;
  
    // Ensure that the URL matches the backend route
    this.http.post('http://localhost:3000/api/optionnews/summarize-url', { url: this.manualUrl.trim() })
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
  
  

  togglePopup() {
    this.showPopup = !this.showPopup;
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

  filterNewsBySelectedSites() {
    const selectedSites = this.mainUrls.filter(site => site.selected).map(site => site.name);

    if (selectedSites.length === 0) {
      this.filterNews(); // No sites selected, show all news
    } else {
      this.activeNews = this.optionnews.filter(article =>
        !article.archive && selectedSites.includes(this.extractSiteName(new URL(article.url).hostname))
      );
      this.archivedNews = this.optionnews.filter(article =>
        article.archive && selectedSites.includes(this.extractSiteName(new URL(article.url).hostname))
      );
    }

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
    const archivedArticleop = {
      id: article._id,
      headline: article.headline,
      summary: article.summary,
      sentimentScore: article.sentimentScore,
      sentiment: article.sentiment,
      articleDateTime: article.articleDateTime,
      imageUrl: article.imageUrl || 'defaultImage' // Fallback image if none provided
    };

    // Call the UserService method to archive the article for the user
    this.userService.archiveArticleop(this.userService.getEmail(), archivedArticleop).subscribe(() => {
      article.archive = true; // Mark the article as archived in the UI
      this.filterNews(); // Call your method to filter the news
      this.updatePagedNews(); // Call your method to update the paged news
      
    });

    this.optionnewsService.archiveOptionnews(article._id).subscribe(() => {
       article.archive = true;
       
    });
  }

  fetchArchivedArticles() {
    const email = this.userService.getEmail(); // Get email from the UserService
    this.userService.getArchivedArticlesop(email).subscribe(
    (data) => {
      console.log('Fetched data:', data); // Check the structure of the data
    this.archivedArticlesop = data;
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
}
