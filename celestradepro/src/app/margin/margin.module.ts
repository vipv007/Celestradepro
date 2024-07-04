import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarginPageRoutingModule } from './margin-routing.module';

import { MarginPage } from './margin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarginPageRoutingModule
  ],
  declarations: [MarginPage]
})
export class MarginPageModule {}
