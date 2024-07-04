import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private baseUrl = 'http://localhost:3000/api/portfolio';
  storeFormData: any;

  constructor(private http: HttpClient) { }

  getAllPortfolio() {
    return this.http.get(`${this.baseUrl}`);
  }

  createPortfolio(portfolioData: any): Observable<any> { // Adjust Portfolio type if exists
    return this.http.post<any>(this.baseUrl, portfolioData);
  }
  
   updateOrderType(portfolioItemId: string, newOrderType: string): Observable<any> {
    const updateUrl = `${this.baseUrl}/${portfolioItemId}`;
    return this.http.put<any>(updateUrl, { order: newOrderType });
  }
  
}
