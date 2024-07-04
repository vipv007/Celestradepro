import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommodityService { 

  private baseUrl = 'http://localhost:3000/api/commodity';
   private apiUrl = 'https://www.oil-price.net/COMMODITIES/gen.php?lang=en';

  constructor(private http: HttpClient) { }

  getCommodities() {
    return this.http.get(`${this.baseUrl}`);
  }

  getDataBySymbol(Symbol: string) {
    return this.http.get(`${this.baseUrl}/${Symbol}`);
  }

  addSelectedCom(comId: string) {
    return this.http.put<any>(`${this.baseUrl}/addSelectedCom`, { id: comId });
  }

  removeSelectedCom(comId: string) {
    return this.http.put<any>(`${this.baseUrl}/removeSelectedCom`, { id: comId });
  }

  getSelectedComs() {
    return this.http.get<any[]>(`${this.baseUrl}/selected`);
  }

   getCommodityPrices() {
    return this.http.get<any>(this.apiUrl);
  }

}
