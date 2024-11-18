import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

 import * as PlotlyJS from 'plotly.js/dist/plotly.js';
 import { PlotlyModule } from 'angular-plotly.js';
 import { IgxFinancialChartModule, IgxLegendModule } from "igniteui-angular-charts";

 PlotlyModule.plotlyjs = PlotlyJS;

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { ForexchartComponent } from './forexchart/forexchart.component';
import { Tab1PageModule } from '../tab1/tab1.module';
import { CalenderComponent } from './calender/calender.component';
import { FundamentalviewComponent } from './fundamentalview/fundamentalview.component';
import { InterestComponent } from './interest/interest.component';
import { ForexcrossComponent } from './forexcross/forexcross.component';
import { ScreenerComponent } from './screener/screener.component';
import { NewsComponent } from './news/news.component';
import { ForexchComponent } from '../forexch/forexch.component';
import { FmultichartComponent } from './fmultichart/fmultichart.component';
import { EventModalComponent } from './event-modal/event-modal.component';
import { GainerComponent } from './gainer/gainer.component';
import { EarningsComponent } from './earnings/earnings.component';
import { MarkethourComponent } from './markethour/markethour.component';
import { GbpusdComponent } from './gbpusd/gbpusd.component';
import { UsdgpyComponent } from './usdgpy/usdgpy.component';
import { FxSentimentComponent } from './fx-sentiment/fx-sentiment.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';
import { EurusdComponent } from './eurusd/eurusd.component';
import { AudusdComponent } from './audusd/audusd.component';
import { ForexliveComponent } from './forexlive/forexlive.component';


@NgModule({
    declarations: [Tab3Page, ForexchartComponent, CalenderComponent, MarkethourComponent ,InterestComponent,GainerComponent,
    FundamentalviewComponent, ForexcrossComponent, ScreenerComponent, NewsComponent, ForexchComponent,
    FmultichartComponent, EventModalComponent, EarningsComponent,GbpusdComponent,UsdgpyComponent,EurusdComponent,AudusdComponent
    ,FxSentimentComponent,ForexliveComponent],
    exports:[ForexchComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        PlotlyModule,
        Ng2SearchPipeModule,
        IgxFinancialChartModule,
        IgxLegendModule,
        ExploreContainerComponentModule,
        RouterModule.forChild([{ path: '', component: Tab3Page }]),
        Tab3PageRoutingModule,
        NgxPaginationModule,
        ChartsModule
    ]
})
export class Tab3PageModule {}
