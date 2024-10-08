import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompriPage } from './compri.page';

const routes: Routes = [
  {
    path: '',
    component: CompriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompriPageRoutingModule {}
