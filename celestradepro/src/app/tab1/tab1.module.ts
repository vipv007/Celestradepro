import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;
import { IgxFinancialChartModule, IgxLegendModule } from "igniteui-angular-charts";

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ChartsComponent } from './charts/charts.component';
import { RibbonComponent } from './ribbon/ribbon.component';
import { Chart1Component } from './chart1/chart1.component';
import { EarningComponent } from './earning/earning.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { ProfileComponent } from './profile/profile.component';
import { MetricsComponent } from './metrics/metrics.component';
import { MultichartComponent } from './multichart/multichart.component';
import { WidgetchartComponent } from './widgetchart/widgetchart.component';
import { TechanalysisComponent } from './techanalysis/techanalysis.component';
import { ScreenerComponent } from './screener/screener.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { StockmarketComponent } from './stockmarket/stockmarket.component';
import { TechnicalAnalysisComponent } from './technical-analysis/technical-analysis.component';
import { FundamendalComponent } from 'src/app/fundamendal/fundamendal.component';
import { AnalystockComponent } from 'src/app/analystock/analystock.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts'; 
import { DividendComponent } from '../dividend/dividend.component';
import { ShareholderComponent } from './shareholder/shareholder.component';
import { SectorComponent } from './sector/sector.component';
import { InsiderComponent } from './insider/insider.component';

@NgModule({
    declarations: [Tab1Page, ChartsComponent, RibbonComponent, Chart1Component, EarningComponent,FundamendalComponent,DividendComponent,
        AnalysisComponent, ProfileComponent, MetricsComponent, MultichartComponent, WidgetchartComponent, AnalystockComponent,
        ShareholderComponent,InsiderComponent,
        TechanalysisComponent, ScreenerComponent,HeatmapComponent, StockmarketComponent,  TechnicalAnalysisComponent,SectorComponent],


    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        PlotlyModule,
        ReactiveFormsModule,
        ExploreContainerComponentModule,
        Tab1PageRoutingModule,
        Ng2SearchPipeModule,
        HttpClientModule,
        IgxFinancialChartModule,
        IgxLegendModule,
        ChartsModule,
        NgxPaginationModule 
    ]
})
export class Tab1PageModule {}