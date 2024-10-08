import { Component, OnInit } from '@angular/core';
import { HourService } from '../services/hour.service';

@Component({
  selector: 'app-nifty',
  templateUrl: './nifty.page.html',
  styleUrls: ['./nifty.page.scss'],
})
export class NiftyPage implements OnInit {
  technicals: any;

  constructor(private hourService: HourService) {}

  ngOnInit(): void {
    this.fetchtechnical();
  }

  fetchtechnical(): void {
    this.hourService.getHour().subscribe((response: any) => {
      this.technicals = response;
      console.log( this.technicals);
    });
  }
}
