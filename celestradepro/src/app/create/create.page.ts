import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForexService } from '../services/forex.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  forexs: any[] = [];
  forexData: any = {}; // Object to hold data for each forex symbol
  selectedSymbol: string | null = null; // Variable to hold the currently selected symbol
  selectedTheme: string = 'light'; // Default theme

  constructor(private forexService: ForexService, private router: Router) {}

  ngOnInit() {
    this.fetchforexs();
  }

  fetchforexs() {
    this.forexService.getAllForexs().subscribe((response: any) => {
      this.forexs = response;
      this.forexs.forEach(values => {
        this.forexData[values.symbol] = values.values.map(dataPoint => ({
          date: new Date(dataPoint.Date),
          open: dataPoint.Open,
          high: dataPoint.High,
          low: dataPoint.Low,
          close: dataPoint.Close,
          volume: dataPoint.Volume
        }));
      });
      console.log('Processed forex data:', this.forexData);
    });
  }

  onSymbolChange(event: any) {
    this.selectedSymbol = event.target.value; // Update the selected symbol based on radio button change
  }

  onThemeToggle(event: any) {
    this.selectedTheme = event.target.checked ? 'dark' : 'light'; // Toggle theme based on switch
  }
}
