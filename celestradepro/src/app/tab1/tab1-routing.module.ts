import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';
import { AnalysisComponent } from './analysis/analysis.component'; // Import AnalysisComponent


const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
  },
   {
    path: 'analysis',
    component: AnalysisComponent,
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
