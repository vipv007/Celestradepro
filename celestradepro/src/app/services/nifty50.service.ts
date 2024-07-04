import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class Nifty50Service {


  private baseUrl = 'http://localhost:3000/api/nifty';
  

  constructor(private http: HttpClient) { }

  getNifty() {
    return this.http.get(`${this.baseUrl}`);
  }
}