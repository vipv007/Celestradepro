/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
})
export class CalenderComponent implements OnInit  {

  Calendar: any[];
Calendars: any;



  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.calendarService.getAllCalendardata().subscribe((response: any) => {
      this.Calendar = response;
      console.log(this.Calendar);

    });
  }
}
 