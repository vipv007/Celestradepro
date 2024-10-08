import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ribbon',
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.scss'],
})
export class RibbonComponent implements AfterViewInit {
  @ViewChild('tradingview') tradingview?: ElementRef;
  showWidget: boolean = false;  // Initially hidden
  scriptElement?: HTMLScriptElement;

  constructor(private _renderer2: Renderer2, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // The widget will only be loaded when toggled
  }

  loadTradingViewWidget() {
    if (this.tradingview && !this.scriptElement) {
      this.scriptElement = this._renderer2.createElement('script');
      this.scriptElement.type = 'text/javascript';
      this.scriptElement.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      this.scriptElement.text = `
      {
        "symbols": [
          { "description": "", "proName": "NASDAQ:AAPL" },
          { "description": "", "proName": "NASDAQ:MSFT" },
          { "description": "", "proName": "NASDAQ:AMZN" },
          { "description": "", "proName": "NASDAQ:GOOGL" },
          { "description": "", "proName": "NASDAQ:NVDA" }
        ],
        "showSymbolLogo": true,
        "isTransparent": false,
        "displayMode": "adaptive",
        "colorTheme": "light",
        "locale": "en"
      }`;

      this.tradingview.nativeElement.appendChild(this.scriptElement);
    }
  }

  toggleWidget() {
    this.showWidget = !this.showWidget;  // Toggle widget visibility
    if (this.showWidget) {
      this.loadTradingViewWidget();  // Load the widget when toggled on
    } else if (this.tradingview) {
      // Clear the widget content when hidden
      this.tradingview.nativeElement.innerHTML = '';  // Clear the content
      this.scriptElement = undefined;  // Reset the script reference
    }
    console.log('Toggle widget method called');
  }
}
