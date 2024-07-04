import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CreatePageRoutingModule } from './create-routing.module';

import { IgxFinancialChartModule, IgxLegendModule } from "igniteui-angular-charts";


import { CreatePage } from './create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IgxFinancialChartModule,
    IgxLegendModule,
    CreatePageRoutingModule
  ],
  declarations: [CreatePage],
 
})
export class CreatePageModule {}
