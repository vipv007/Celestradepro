import { Component, OnInit } from '@angular/core';
import { GainerService } from 'src/app/services/gainer.service';

@Component({
  selector: 'app-gainer',
  templateUrl: './gainer.component.html',
  styleUrls: ['./gainer.component.scss'],
})
export class GainerComponent implements OnInit {

  topGainers: any[] = [];
  topLosers: any[] = [];

  constructor(private gainerService: GainerService) { }

  ngOnInit(): void {
    this.getTopGainersAndLosers();
  }

  getTopGainersAndLosers(): void {
    this.gainerService.getTopGainersAndLosers().subscribe(
      data => {
        this.topGainers = data.topGainers;
        this.topLosers = data.topLosers;
      },
      error => console.error('Error fetching top gainers and losers', error)
    );
  }
}
