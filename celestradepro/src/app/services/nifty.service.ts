import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NiftyService {
 
  private apiUrl = 'http://localhost:5000/stock';  // URL to your Python backend

  constructor(private http: HttpClient) {}

  getStockData(symbol: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${symbol}`);
  }
}
