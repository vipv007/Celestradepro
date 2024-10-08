import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private baseUrl = 'http://localhost:3000/api/stocks';
 
  constructor(private http: HttpClient, private router: Router) { }

  getAllStocks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
  
  getStockBySymbol(symbol: string) {
    return this.http.get(`${this.baseUrl}/${symbol}`);
  }

  createStock(stock: any) {
    return this.http.post(`${this.baseUrl}`, stock);
  }

 addSelectedStock(stockId: string) {
    return this.http.put<any>(`${this.baseUrl}/addSelectedStock`, { id: stockId });
  }

  removeSelectedStock(stockId: string) {
    return this.http.put<any>(`${this.baseUrl}/removeSelectedStock`, { id: stockId });
  }

  getSelectedStocks() {
    return this.http.get<any[]>(`${this.baseUrl}/selected`);
  }

   setClickedStock(symbol: string) {
    console.log('Clicked Stock:', symbol);
    this.router.navigate(['/tabs/tab1'], { queryParams: { symbol } });
  }
  
}
