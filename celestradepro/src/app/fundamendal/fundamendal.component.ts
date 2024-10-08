import { Component, OnInit, AfterViewInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-fundamendal',
  templateUrl: './fundamendal.component.html',
  styleUrls: ['./fundamendal.component.scss'],
})
export class FundamendalComponent implements OnInit, AfterViewInit {

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.loadTradingViewWidget('widget-msft', 'NASDAQ:MSFT');
    this.loadTradingViewWidget('widget-amzn', 'NASDAQ:AMZN');
    this.loadTradingViewWidget('widget-aapl', 'NASDAQ:AAPL');
    this.loadTradingViewWidget('widget-googl', 'NASDAQ:GOOGL');
  }

  loadTradingViewWidget(containerId: string, symbol: string): void {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-financials.js';
    script.innerHTML = `
      {
        "isTransparent": false,
        "largeChartUrl": "",
        "displayMode": "regular",
        "width": 400,
        "height": 550,
        "colorTheme": "light",
        "symbol": "${symbol}",
        "locale": "en"
      }
    `;

    script.onload = () => {
      console.log(`TradingView widget loaded successfully for ${symbol}`);
    };

    script.onerror = (error: any) => {
      console.error(`Failed to load TradingView widget for ${symbol}`, error);
    };

    this.renderer.appendChild(this.el.nativeElement.querySelector(`#${containerId}`), script);
  }
}
