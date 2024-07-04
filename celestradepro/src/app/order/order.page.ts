import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  number1: number;
  number2: number;
  number3: number;
  number4: number;
  number5: number;
  number6: number;
selectedSegment: any;
  constructor() { }

  ngOnInit() {
  }

}
