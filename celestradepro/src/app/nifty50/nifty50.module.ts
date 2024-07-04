import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { IonicModule } from '@ionic/angular';

import { Nifty50PageRoutingModule } from './nifty50-routing.module';

import { Nifty50Page } from './nifty50.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsModule,
    Nifty50PageRoutingModule
  ],
  declarations: [Nifty50Page]
})
export class Nifty50PageModule {}
