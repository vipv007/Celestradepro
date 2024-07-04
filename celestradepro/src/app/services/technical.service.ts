import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnicalService {

  private baseUrl = 'http://localhost:3000/api/technical';

  constructor(private http: HttpClient) {}

  getTechnical(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
