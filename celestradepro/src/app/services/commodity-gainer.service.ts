import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommodityGainerService {

  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getAllComGainers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getComGainersLosers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gainers-losers`);
  }
}
