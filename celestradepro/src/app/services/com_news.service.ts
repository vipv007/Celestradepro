import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class Com_newsService {

  private baseUrl = 'http://localhost:3000/api/com_news';

  constructor(private http: HttpClient) { }

  // getCom_news() {
  //   return this.http.get(`${this.baseUrl}`);
  // }
  getCom_news(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  } 

  archiveCom_news(articleId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${articleId}/archive`, {});
  }
}
