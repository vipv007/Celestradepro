import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Nifty50Service } from 'src/app/services/nifty50.service';

@Component({
  selector: 'app-techanalysis',
  templateUrl: './techanalysis.component.html',
  styleUrls: ['./techanalysis.component.scss'],
})
export class TechanalysisComponent  {
//   @ViewChild('tradingview', { static: true }) tradingview!: ElementRef;

//   constructor(private renderer: Renderer2) { }

//   ngAfterViewInit() {
//     const script = this.renderer.createElement('script');
//     script.type = `text/javascript`;
//     script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
//     script.text = `
//     {
//         "symbol": "NASDAQ:AMZN",
//         "width": "100",
//         "height": "100",
//         "locale": "en",
//         "dateRange": "1D",
//         "colorTheme": "light",
//         "trendLineColor": "rgba(152, 0, 255, 1)",
//         "underLineColor": "rgba(152, 0, 255, 1)",
//         "underLineBottomColor": "rgba(0, 255, 255, 0)",
//         "isTransparent": false,
//         "autosize": true,
//         "largeChartUrl": "",
//         "chartOnly": true,
//         "noTimeScale": true
//     }`;

//     this.renderer.appendChild(this.tradingview.nativeElement, script);
//   }
// }
nifty: any;

  constructor(private nifty50Service: Nifty50Service) {}

  ngOnInit(): void {
    this.fetchnifty();
  }

  fetchnifty(): void {
    this.nifty50Service.getNifty().subscribe((response: any) => {
      this.nifty = response;
      console.log( this.nifty);
    });
  }
}
