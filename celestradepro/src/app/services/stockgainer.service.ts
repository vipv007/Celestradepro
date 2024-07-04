// gainer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockGainerService {

  private baseUrl: string = 'http://localhost:3000/api'; // Update this URL to match your backend endpoint

  constructor(private http: HttpClient) { }

  getAllGainersAndLosers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gainer-loser`);
  }
  getGainersAndLosers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gainer-loser`);
  }
}
