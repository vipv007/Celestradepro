import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { Nifty50Service } from '../services/nifty50.service';
import * as ta from 'ta-lib'; // Import ta-lib library

@Component({
  selector: 'app-nifty50',
  templateUrl: './nifty50.page.html',
  styleUrls: ['./nifty50.page.scss'],
})
export class Nifty50Page  {

}
