import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-comcalender',
  templateUrl: './comcalender.component.html',
  styleUrls: ['./comcalender.component.scss'],
})
export class ComcalenderComponent implements OnInit {
  Calendar: any[] = [];
  filteredCalendar: any[] = [];
  showTable: boolean = true;
  searchText: string = '';
  startDate: string;
  endDate: string;

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.calendarService.getAllCalendar().subscribe((response: any) => {
      this.Calendar = response;
      this.filteredCalendar = this.Calendar;
      console.log(this.Calendar);
    });
  }

  toggleView() {
    this.showTable = !this.showTable; // Toggle the value of showTable
  }

  applyFilters() {
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;

    this.filteredCalendar = this.Calendar.filter(item => {
      const itemDate = new Date(item.Date);
      const matchesSearchText = !this.searchText || 
        item.Event.toLowerCase().includes(this.searchText.toLowerCase()) || 
        item.Country.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStartDate = !start || itemDate >= start;
      const matchesEndDate = !end || itemDate <= end;

      return matchesSearchText && matchesStartDate && matchesEndDate;
    });
  }
}
