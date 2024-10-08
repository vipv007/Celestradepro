import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsiderService {

  private baseUrl = 'http://localhost:3000/api/insider';

  constructor(private http: HttpClient) {}

  getInsider(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
