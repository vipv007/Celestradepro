import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild  } from '@angular/core';

@Component({
  selector: 'app-ribon',
  templateUrl: './ribon.page.html',
  styleUrls: ['./ribon.page.scss'],
})
export class RibonPage implements AfterViewInit {
  @ViewChild('tradingview') tradingview?: ElementRef;

  constructor(private _renderer2: Renderer2) { }

  ngAfterViewInit(){
    const script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.text = `
    {
      "symbols": [
        {
          "description": "",
          "proName": "NASDAQ:AAPL"
        },
        {
          "description": "",
          "proName": "NASDAQ:MSFT"
        },
        {
          "description": "",
          "proName": "NASDAQ:AMZN"
        },
        {
          "description": "",
          "proName": "NASDAQ:GOOGL"
        },
        {
          "description": "",
          "proName": "NASDAQ:NVDA"
        }
      ],
      "showSymbolLogo": true,
      "isTransparent": false,
      "displayMode": "adaptive",
      "colorTheme": "light",
      "locale": "en"
    }`;

    this.tradingview?.nativeElement.appendChild(script);
  }
}
