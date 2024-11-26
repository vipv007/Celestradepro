import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private baseUrl = 'https://celescontainerwebapp.azurewebsites.net/api';

  constructor(private http: HttpClient) { }

  getAllNews(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

   archiveNews(articleId: string): Observable<any> {
     return this.http.put(`${this.baseUrl}/${articleId}/archive`, {});
  }

  getTopSentimentScores(): Observable<any[]> {
    return this.http.get<any[]>(`https://celescontainerwebapp-server.mongo.cosmos.azure.com:3000/api/top10-sentiment-news`);
  }
}
