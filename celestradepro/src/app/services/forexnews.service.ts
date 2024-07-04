import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForexnewsService {
  private baseUrl = 'http://localhost:3000/api/fnews';

  constructor(private http: HttpClient) { }

  getAllFnews(): Observable<any> {
    return this.http.get<any[]>(this.baseUrl);
  }

  archiveNews(newsId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${newsId}/archive`, {});
  }
}
