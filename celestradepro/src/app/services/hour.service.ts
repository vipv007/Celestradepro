import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HourService {
  private baseUrl = 'http://localhost:3000/api/hour';

  constructor(private http: HttpClient) {}

  getHour(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
