import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Comprof {
  _id: string;
  country: string;
  currency: string;
  estimateCurrency: string;
  exchange: string;
  finnhubIndustry: string;
  founded: string;
  logo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
}

@Component({
  selector: 'app-comprof',
  templateUrl: './comprof.component.html',
  styleUrls: ['./comprof.component.scss'],
})
export class ComprofComponent implements OnInit {

  earns: Comprof[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<Comprof[]>('http://localhost:3000/com-prof').subscribe(
      data => {
        this.earns = data;
        console.log('Fetched data:', this.earns); // Display fetched data in the console
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
