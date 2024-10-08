import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService { 
 
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getAllCalendar() {
    return this.http.get(`${this.baseUrl}/calendar`);
  }
  
  getAllCalendardata() {
    return this.http.get(`${this.baseUrl}/Calendarrep`);
  }

   getFinancialData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/finrevpro`);
  }
}
