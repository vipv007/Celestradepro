import { Component, OnInit } from '@angular/core';
import { DatasService } from '../../services/datas.service';

@Component({
  selector: 'app-opstrike-pegger',
  templateUrl: './opstrike-pegger.component.html',
  styleUrls: ['./opstrike-pegger.component.scss'],
})
export class OpstrikePeggerComponent implements OnInit {

  symbol: string = '';
  date: string = '';
  data: any[] = [];
  availableDates: string[] = [];

  constructor(private datasService: DatasService) { }

  ngOnInit() {}

  fetchData() {
    if (this.symbol && this.date) {
      this.datasService.getData(this.symbol, this.date).subscribe(
        (res) => {
          this.data = res;
        },
        (err) => {
          console.error('Error fetching data:', err);
        }
      );
    } else {
      alert("Please enter both symbol and date.");
    }
  }

  onDateChange(event: any) {
    this.date = event.target.value;
  }

  onSymbolChange(event: any) {
    this.symbol = event.target.value;
    this.fetchAvailableDates();
  }

  fetchAvailableDates() {
    if (this.symbol) {
      this.datasService.getAvailableDates(this.symbol).subscribe(
        (res) => {
          this.availableDates = res;
        },
        (err) => {
          console.error('Error fetching available dates:', err);
        }
      );
    }
  }
}
