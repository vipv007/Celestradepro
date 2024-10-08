import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrtPageRoutingModule } from './crt-routing.module';
import { RibbonComponent } from 'src/app/tab1/ribbon/ribbon.component';
import { CrtPage } from './crt.page';
import { EventsComponent } from './events/events.component';
import { TopnewsComponent } from './topnews/topnews.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CrtPageRoutingModule
  ],
  declarations: [CrtPage , RibbonComponent,EventsComponent,TopnewsComponent]
})
export class CrtPageModule {}
