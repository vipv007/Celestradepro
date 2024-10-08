import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'celestradepro',
    component: TabsPage,
    children: [
      {
        path: 'Stocks',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'Options',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'Forex',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'Portfolio',
        loadChildren: () => import('../portfolio/portfolio.module').then(m => m.PortfolioPageModule)
      },
      {
        path: 'Futures',
        loadChildren: () => import('../tile/tile.module').then(m => m.TilePageModule)
      },

       {
        path: 'homes',
        loadChildren: () => import('../crt/crt.module').then(m => m.CrtPageModule)
      },
      {
        path: '',
        redirectTo: '/celestradepro/homes',
        pathMatch: 'full'
      }
    ]
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
