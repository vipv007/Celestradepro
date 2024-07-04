import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasService {

  private apiUrl = 'http://localhost:3000/api/data';

  constructor(private http: HttpClient) { }

  getData(symbol: string, date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?symbol=${symbol}&date=${date}`);
  }

  getAvailableDates(symbol: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/dates?symbol=${symbol}`);
  }
}
