import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketdepthService {

  private baseUrl = 'http://localhost:3000/api/marketdepth';

  constructor(private http: HttpClient) { }

 getAllMarketDepth(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
