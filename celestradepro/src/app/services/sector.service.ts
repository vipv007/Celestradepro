import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  private baseUrl = 'http://localhost:3000/api/sector';

  constructor(private http: HttpClient) {}

  getSector(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
