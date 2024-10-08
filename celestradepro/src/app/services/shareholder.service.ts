
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareholderService {
  
  private baseUrl = 'http://localhost:3000/api/dividend';

   constructor(private http: HttpClient) { }

  getShareholders(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
