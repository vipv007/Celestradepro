import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'celestradepro/homes',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'nifty',
    loadChildren: () => import('./nifty/nifty.module').then( m => m.NiftyPageModule)
  },

  {
    path: 'indestreies',
    loadChildren: () => import('./indestreies/indestreies.module').then( m => m.IndestreiesPageModule)
  },


{
    path: 'vix',
    loadChildren: () => import('./vix/vix.module').then( m => m.VixPageModule)
  },
  {
    path: 'sp',
    loadChildren: () => import('./sp/sp.module').then( m => m.SpPageModule)

 },

  {

    path: 'table',
    loadChildren: () => import('./table/table.module').then( m => m.TablePageModule)
  },


  {
    path: 'chart',
    loadChildren: () => import('./chart/chart.module').then( m => m.ChartPageModule)
  },

  {
    path: 'db',
    loadChildren: () => import('./db/db.module').then( m => m.DbPageModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  },{
    path: 'update/:id',
    loadChildren: () => import('./update/update.module').then( m => m.UpdatePageModule)
  },
  {
    path: 'homes',
    loadChildren: () => import('./crt/crt.module').then( m => m.CrtPageModule)
  },
  {
    path: 'lst',
    loadChildren: () => import('./lst/lst.module').then( m => m.LstPageModule)
  },
  {
    path: 'upt/:id',
    loadChildren: () => import('./upt/upt.module').then( m => m.UptPageModule)
  },
  {
    path: 'upd/:id',
    loadChildren: () => import('./upd/upd.module').then( m => m.UpdPageModule)
  },

  {
    path: 'niftycreate',
    loadChildren: () => import('./niftycreate/niftycreate.module').then( m => m.NiftycreatePageModule)
  },
  {
    path: 'niftylist',
    loadChildren: () => import('./niftylist/niftylist.module').then( m => m.NiftylistPageModule)
  },
  {
    path: 'niftyupdate',
    loadChildren: () => import('./niftyupdate/niftyupdate.module').then( m => m.NiftyupdatePageModule)
  },
  {
    path: 'spcreate',
    loadChildren: () => import('./spcreate/spcreate.module').then( m => m.SpcreatePageModule)
  },
  {
    path: 'npcreate',
    loadChildren: () => import('./npcreate/npcreate.module').then( m => m.NpcreatePageModule)
  },
  {
    path: 'nplist',
    loadChildren: () => import('./nplist/nplist.module').then( m => m.NplistPageModule)
  },
  {
    path: 'vixcreate',
    loadChildren: () => import('./vixcreate/vixcreate.module').then( m => m.VixcreatePageModule)
  },
  {
    path: 'vp',
    loadChildren: () => import('./vp/vp.module').then( m => m.VpPageModule)
  },
  {
    path: 'spp',
    loadChildren: () => import('./spp/spp.module').then( m => m.SppPageModule)
  },
  {
    path: 'chart1',
    loadChildren: () => import('./chart1/chart1.module').then( m => m.Chart1PageModule)
  },
  {
    path: 'Futures',
    loadChildren: () => import('./tile/tile.module').then( m => m.TilePageModule)
  },
  {
    path: 'optionupdate',
    loadChildren: () => import('./optionupdate/optionupdate.module').then( m => m.OptionupdatePageModule)
  },


  {
    path: 'property',
    loadChildren: () => import('./property/property.module').then( m => m.PropertyPageModule)
  },
  {
    path: 'stock',
    loadChildren: () => import('./stock/stock.module').then( m => m.StockPageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then( m => m.NewsPageModule)
  },
  {
    path: 'loan',
    loadChildren: () => import('./loan/loan.module').then( m => m.LoanPageModule)
  },
  {

    path: 'forex',
    loadChildren: () => import('./forex/forex.module').then( m => m.ForexPageModule)
  },
  {
    path: 'economic',
    loadChildren: () => import('./economic/economic.module').then( m => m.EconomicPageModule)
  },
  {
    path: 'earning',
    loadChildren: () => import('./earning/earning.module').then( m => m.EarningPageModule)
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.module').then( m => m.StudentPageModule)
  },
  {
    path: 'detail',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  },

  {
    path: 'cret',
    loadChildren: () => import('./cret/cret.module').then( m => m.CretPageModule)
  },

  {
    path: 'receipt',
    loadChildren: () => import('./receipt/receipt.module').then( m => m.ReceiptPageModule)
  },
  {

  path: 'cres',
    loadChildren: () => import('./cres/cres.module').then( m => m.CresPageModule)
  },
  {

    path: 'cre',
    loadChildren: () => import('./cre/cre.module').then( m => m.CrePageModule)
  },
  {
    path: 'upp/:id',
    loadChildren: () => import('./upp/upp.module').then( m => m.UppPageModule)
  },
  {
    path: 'Portfolio',
    loadChildren: () => import('./portfolio/portfolio.module').then( m => m.PortfolioPageModule)
  },
  {
    path: 'forex-update/:id',
    loadChildren: () => import('./forex-update/forex-update.module').then( m => m.ForexUpdatePageModule)

  },

  {
    path: 'tile1',
    loadChildren: () => import('./tile1/tile1.module').then( m => m.Tile1PageModule)
  },
  {
    path: 'land',
    loadChildren: () => import('./land/land.module').then( m => m.LandPageModule)
  },
  {
    path: 'graph',
    loadChildren: () => import('./graph/graph.module').then( m => m.GraphPageModule)
  },
  {
    path: 'plots',
    loadChildren: () => import('./plots/plots.module').then( m => m.PlotsPageModule)
  },

  {
    path: 'ups/:id',
    loadChildren: () => import('./ups/ups.module').then( m => m.UpsPageModule)
  },
  {
    path: 'trading',
    loadChildren: () => import('./trading/trading.module').then( m => m.TradingPageModule)
  },
  {
    path: 'trading-view',
    loadChildren: () => import('./trading-view/trading-view.module').then( m => m.TradingViewPageModule)
  },
  {
    path: 'widget',
    loadChildren: () => import('./widget/widget.module').then( m => m.WidgetPageModule)
  },
  {
    path: 'ge',
    loadChildren: () => import('./ge/ge.module').then( m => m.GEPageModule)
  },
  {
    path: 'ribon',
    loadChildren: () => import('./ribon/ribon.module').then( m => m.RibonPageModule)
  },
  {
    path: 'bill',
    loadChildren: () => import('./bill/bill.module').then( m => m.BillPageModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./otp/otp.module').then( m => m.OtpPageModule)
  },
  {
    path: 'option1',
    loadChildren: () => import('./option1/option1.module').then( m => m.Option1PageModule)
  },
  {
    path: 'opchart',
    loadChildren: () => import('./opchart/opchart.module').then( m => m.OpchartPageModule)
  },
  {
    path: 'openintrest',
    loadChildren: () => import('./openintrest/openintrest.module').then( m => m.OpenintrestPageModule)
  },
  {
    path: 'fchart',
    loadChildren: () => import('./fchart/fchart.module').then( m => m.FchartPageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then( m => m.OrderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'margin',
    loadChildren: () => import('./margin/margin.module').then( m => m.MarginPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'compri',
    loadChildren: () => import('./compri/compri.module').then( m => m.CompriPageModule)
  },
  {
    path: 'otp-login',
    loadChildren: () => import('./otp-login/otp-login.module').then( m => m.OtpLoginPageModule)
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then( m => m.BlogPageModule)
  },
























];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
