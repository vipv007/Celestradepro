import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HolderService {

  private baseUrl = 'http://localhost:3000/api/holder';

  constructor(private http: HttpClient) {}

  getHolder(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
