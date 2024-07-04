import { Component, OnInit } from '@angular/core';
import { TechnicalService } from '../services/technical.service';

@Component({
  selector: 'app-nifty',
  templateUrl: './nifty.page.html',
  styleUrls: ['./nifty.page.scss'],
})
export class NiftyPage implements OnInit {
  technicals: any;

  constructor(private technicalService: TechnicalService) {}

  ngOnInit(): void {
    this.fetchtechnical();
  }

  fetchtechnical(): void {
    this.technicalService.getTechnical().subscribe((response: any) => {
      this.technicals = response;
      console.log( this.technicals);
    });
  }
}
