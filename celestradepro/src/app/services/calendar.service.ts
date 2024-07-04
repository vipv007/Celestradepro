import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService { 
 
  private baseUrl = 'http://localhost:3000/api/calendar';

  constructor(private http: HttpClient) { }

  getAllCalendar() {
    return this.http.get(`${this.baseUrl}`);
  }

}
