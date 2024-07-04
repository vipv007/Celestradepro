import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarginPage } from './margin.page';

const routes: Routes = [
  {
    path: '',
    component: MarginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarginPageRoutingModule {}
