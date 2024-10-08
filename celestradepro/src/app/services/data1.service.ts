import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/update-data'; // Update with your server URL

  constructor(private http: HttpClient) { }

  getCommodityData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
