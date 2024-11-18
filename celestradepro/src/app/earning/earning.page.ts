import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-earning',
  templateUrl: './earning.page.html',
  styleUrls: ['./earning.page.scss'],
})
export class EarningPage implements OnInit {
  filterTerm: string; // Declare the variable
  earn: any[]; // or appropriate type
  
  constructor() { }

  ngOnInit() {
  }
  

}
