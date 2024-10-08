import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GEPageRoutingModule } from './ge-routing.module';

import { GEPage } from './ge.page';
import { NgxChartsModule } from '@swimlane/ngx-charts'; // Import NgxChartsModule

import { ChartsModule } from 'ng2-charts';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GEPageRoutingModule,
    NgxChartsModule,
    ChartsModule
  ],
  declarations: [GEPage]
})
export class GEPageModule {}
