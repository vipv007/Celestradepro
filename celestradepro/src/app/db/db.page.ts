import { Component, OnInit } from '@angular/core';
import { CommodityService } from '../services/commodity.service';

@Component({
  selector: 'app-db',
  templateUrl: './db.page.html',
  styleUrls: ['./db.page.scss'],
})
export class DbPage implements OnInit {
  Commodities: any[] = [];
  CommoditiesData: { [key: string]: any[] } = {}; // Object to hold data for each commodity symbol
  selectedSymbol: string | null = null; // Variable to hold the currently selected symbol

  constructor(private commodityService: CommodityService) {}

  ngOnInit() {
    this.fetchCommodities();
  }

  fetchCommodities() {
    this.commodityService.getCommodities().subscribe((response: any) => {
      this.Commodities = response;
      console.log(this.Commodities);
      this.Commodities.forEach(data => {
        this.CommoditiesData[data.Commodity] = data.Data.map(dataPoint => ({
          date: new Date(dataPoint.Date),
          open: dataPoint.Open,
          high: dataPoint.High,
          low: dataPoint.Low,
          close: dataPoint.Close,
          volume: dataPoint.Volume
        }));
      });
      console.log('Processed commodity data:', this.CommoditiesData);
    });
  }

  onSymbolChange(event: any) {
    this.selectedSymbol = event.target.value; // Update the selected symbol based on radio button change
  }
}
