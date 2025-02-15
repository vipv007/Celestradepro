import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-charting',
  templateUrl: './charting.component.html',
  styleUrls: ['./charting.component.scss'],
})
export class ChartingComponent implements AfterViewInit  {
  @ViewChild('tradingview') tradingview?: ElementRef;
  showWidget: boolean = false;  // Default to false to keep the widget hidden initially
  scriptElement?: HTMLScriptElement;

  constructor(private _renderer2: Renderer2, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // The widget will be loaded only when showWidget is toggled to true
  }

  loadTradingViewWidget() {
    if (this.tradingview && !this.scriptElement) {
      // Create the script only if it's not already appended
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
      this.loadTradingViewWidget();  // Load the widget only when it is toggled to true
    } else if (this.tradingview) {
      // Optionally clear the widget content when hidden
      this.tradingview.nativeElement.innerHTML = '';  // Clears the content
      this.scriptElement = undefined;  // Reset the script reference
    }
    console.log('Toggle widget method called');
  }
}
