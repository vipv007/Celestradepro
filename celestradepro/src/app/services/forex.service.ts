import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ForexService {

  private baseUrl = 'http://localhost:3000/api/forexs';

  constructor(private http: HttpClient) { }

  getAllForexs() {
    return this.http.get(`${this.baseUrl}`);
  }

  createForex(forex: any) {
    return this.http.post(`${this.baseUrl}`, forex);
  }

  getDataBySymbol(symbol: string) {
    return this.http.get(`${this.baseUrl}/${symbol}`);
  }

  addSelectedForex(forexId: string) {
    return this.http.put<any>(`${this.baseUrl}/addSelectedForex`, { id: forexId });
  }

  removeSelectedForex(forexId: string) {
    return this.http.put<any>(`${this.baseUrl}/removeSelectedForex`, { id: forexId });
  }

  getSelectedForexs() {
    return this.http.get<any[]>(`${this.baseUrl}/selected`);
  }
}
