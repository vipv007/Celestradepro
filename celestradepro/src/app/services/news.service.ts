import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private baseUrl = 'https://20.118.138.147/api';
  // private baseUrl ='https://finance.celespro.com/api/news';

  constructor(private http: HttpClient) { }

  getAllNews(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

   archiveNews(articleId: string): Observable<any> {
     return this.http.put(`${this.baseUrl}/${articleId}/archive`, {});
  }

  getTopSentimentScores(): Observable<any[]> {
    return this.http.get<any[]>(`https://27.60.165.94/api/top10-sentiment-news`);
  }
}
