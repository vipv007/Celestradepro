import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OptionnewsService {

  private baseUrl = 'http://localhost:3000/api/optionnews';

  constructor(private http: HttpClient) { }

  // getCom_news() {
  //   return this.http.get(`${this.baseUrl}`);
  // }
  getOptionnews(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  } 

   archiveOptionnews(articleId: string): Observable<any> {
   return this.http.put(`${this.baseUrl}/${articleId}/archive`, {});
   }

  summarizeUrl(url: string): Observable<any> {
    return this.http.post<any>(this.baseUrl, { url });
  }
}
