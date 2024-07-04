import { Component, OnInit } from '@angular/core';
import { CommodityGainerService } from 'src/app/services/commodity-gainer.service';

@Component({
  selector: 'app-commodity-gainer',
  templateUrl: './commodity-gainer.component.html',
  styleUrls: ['./commodity-gainer.component.scss']
})
export class CommodityGainerComponent implements OnInit {
  allGainers: any[] = [];
  topGainers: any[] = [];
  topLosers: any[] = [];
  errorMessage: string;

  constructor(private commodityGainerService: CommodityGainerService) { }

  ngOnInit(): void {
    this.getAllComGainers();
    this.getComGainersLosers();
  }

  getAllComGainers(): void {
    this.commodityGainerService.getAllComGainers().subscribe(
      data => this.allGainers = data,
      error => this.errorMessage = error.message
    );
  }

  getComGainersLosers(): void {
    this.commodityGainerService.getComGainersLosers().subscribe(
      data => {
        this.topGainers = data.topGainers;
        this.topLosers = data.topLosers;
      },
      error => this.errorMessage = error.message
    );
  }
}
