// gainer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GainerService {

  private baseUrl: string = 'http://localhost:3000/api'; // Update this URL to match your backend endpoint

  constructor(private http: HttpClient) { }

  getAllGainers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gainers`);
  }
  getTopGainersAndLosers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/top-gainers-and-losers`);
  }
}
