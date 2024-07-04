import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:3000/api/transactions';

  constructor(private http: HttpClient) { }

  storeTransaction(data: any) {
    return this.http.post(`${this.baseUrl}`, data);
  }
}
