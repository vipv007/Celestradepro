import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommodityService {
  private apiUrl = 'http://localhost:3000/api/moving-averages';

  constructor(private http: HttpClient) { }

  getCommodityData(symbol: string): Observable<any> {
    console.log(`Fetching data from ${this.apiUrl}/${symbol}`); // Debugging log
    return this.http.get(`${this.apiUrl}/${symbol}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
