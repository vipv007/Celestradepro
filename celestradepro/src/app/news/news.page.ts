import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  news: any[] = [];
  filteredNews: any[] = [];
  mainUrls: string[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.getAllNews().subscribe(data => {
      this.news = data;
      this.filteredNews = data;
    });
  }

  showMainUrls(): void {
    const urlSet = new Set<string>();
    this.news.forEach(article => {
      const mainUrl = this.extractMainUrl(article.url);
      urlSet.add(mainUrl);
    });
    this.mainUrls = Array.from(urlSet);
  }

  filterNewsByMainUrl(mainUrl: string): void {
    this.filteredNews = this.news.filter(article => this.extractMainUrl(article.url) === mainUrl);
  }

  extractMainUrl(url: string): string {
    const urlObj = new URL(url);
    return urlObj.hostname;
  }
}
