import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ComindexService {

  
  private baseUrl = 'http://localhost:3000/api/comindex';

  constructor(private http: HttpClient) { }

 getComindexs() {
    return this.http.get(`${this.baseUrl}`);
  }

}

