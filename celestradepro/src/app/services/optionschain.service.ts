import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OptionsChainService {

  private baseUrl = 'http://localhost:3000/api/options_chain';

  constructor(private http: HttpClient) { }

  getoptions() {
    return this.http.get(`${this.baseUrl}`);
  }
}
