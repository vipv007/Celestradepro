import { Component, OnInit } from '@angular/core';
import { ScreenerService } from 'src/app/services/screener.service';

@Component({
  selector: 'app-commarket',
  templateUrl: './commarket.component.html',
  styleUrls: ['./commarket.component.scss'],
})
export class CommarketComponent implements OnInit {

  products: any[] = [];

  constructor(private screenerService: ScreenerService) { }

  ngOnInit(): void {
    this.screenerService.getAllScreener().subscribe((data: any[]) => {
      this.products = data;
      console.log(  this.products );
    });
  }
}
