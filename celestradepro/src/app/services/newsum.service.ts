import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/summarize';  // Your backend URL

  constructor(private http: HttpClient) { }

  summarizeUrl(url: string): Observable<any> {
    return this.http.post(this.apiUrl, { url });
  }
}
