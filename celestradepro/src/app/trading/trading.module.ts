import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { BrowserModule } from '@angular/platform-browser';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';

import { TradingPageRoutingModule } from './trading-routing.module';
//import { IgxFinancialChartModule, IgxLegendModule } from 'igniteui-angular-charts';
import { TradingPage } from './trading.page';

@NgModule({
  imports: [
    CommonModule,
   // BrowserModule,
    FormsModule,
    IonicModule,
   // BrowserAnimationsModule,
   // IgxFinancialChartModule,
    TradingPageRoutingModule
  ],
  declarations: [TradingPage]
})
export class TradingPageModule {}
