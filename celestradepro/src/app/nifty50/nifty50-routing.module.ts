import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Nifty50Page } from './nifty50.page';

const routes: Routes = [
  {
    path: '',
    component: Nifty50Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Nifty50PageRoutingModule {}
