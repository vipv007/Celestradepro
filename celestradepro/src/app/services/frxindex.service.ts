import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FrxindexService {

  private baseUrl = 'http://localhost:3000/api/frxindex';

  constructor(private http: HttpClient) { }

 getFrxindexs() {
    return this.http.get(`${this.baseUrl}`);
  }

}
