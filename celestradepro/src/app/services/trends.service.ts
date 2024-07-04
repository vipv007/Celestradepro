import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrendsService {
  private baseUrl = 'http://localhost:3000/api/trends';

  constructor(private http: HttpClient) { }

  getAllTrends(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
}
