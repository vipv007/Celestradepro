import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DividendService {

  private baseUrl = 'http://localhost:3000/api/dividend';

  constructor(private http: HttpClient) {}

  getDividend(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
