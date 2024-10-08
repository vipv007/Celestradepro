import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommodityService {
  private apiUrl = 'http://localhost:3000/api/commodities';

  constructor(private http: HttpClient) { }

  getCommodities(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  
}
