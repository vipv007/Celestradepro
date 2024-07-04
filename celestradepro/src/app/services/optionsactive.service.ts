import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OptionsactiveService {

  private baseUrl = 'http://localhost:3000/api/active';

  constructor(private http: HttpClient) { }

  getAllActive() {
    return this.http.get(`${this.baseUrl}`);
  }

}
