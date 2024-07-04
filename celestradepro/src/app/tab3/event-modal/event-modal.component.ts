import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
})
export class EventModalComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  showButton: boolean = false;
  startDate: string = '';
  endDate: string = '';
  searchTerm: string = '';

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.fetchEvents();
  }

  toggleEvents() {
    this.showButton = !this.showButton;
  }

  fetchEvents() {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
        this.filteredEvents = data;  // Initialize filteredEvents with all events
        console.log('events', this.events);
      },
      (error) => {
        console.error('Error fetching events', error);
      }
    );
  }

  filterEvents() {
    let filtered = this.events;

    // Filter by date range
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate).getTime();
      const end = new Date(this.endDate).getTime();

      filtered = filtered.filter(event => {
        const eventDate = new Date(event.Date).getTime();
        return eventDate >= start && eventDate <= end;
      });
    }

    // Filter by specific date if entered
    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      const enteredDate = new Date(this.searchTerm); // Attempt to parse the search term as a date

      filtered = filtered.filter(event => {
        const eventDate = new Date(event.Date);
        const eventDateStr = eventDate.toLocaleDateString().toLowerCase();
        return (event.Title && String(event.Title).toLowerCase().includes(lowerSearchTerm)) ||
               (event.Country && String(event.Country).toLowerCase().includes(lowerSearchTerm)) ||
               (event.Impact && String(event.Impact).toLowerCase().includes(lowerSearchTerm)) ||
               (event.Forecast && String(event.Forecast).toLowerCase().includes(lowerSearchTerm)) ||
               (event.Previous && String(event.Previous).toLowerCase().includes(lowerSearchTerm)) ||
               (enteredDate && eventDateStr.includes(lowerSearchTerm)); // Check if event date matches the entered date
      });
    }

    this.filteredEvents = filtered;
  }
}
