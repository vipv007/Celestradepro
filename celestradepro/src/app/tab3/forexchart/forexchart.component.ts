import { Component, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';

declare const TradingView: any;

@Component({
  selector: 'app-forexchart',
  templateUrl: './forexchart.component.html',
  styleUrls: ['./forexchart.component.scss'],
})
export class ForexchartComponent implements AfterViewInit {
  @ViewChild('tradingview') tradingview?: ElementRef;
  showWidget: boolean = true; // Default to true to show widget initially
  scriptElement?: HTMLScriptElement;

  constructor(private _renderer2: Renderer2) {}

  ngAfterViewInit() {
    if (this.showWidget) {
      this.loadTradingViewScript().then(() => {
        this.initTradingView();
      }).catch(error => {
        console.error('Error loading TradingView script', error);
      });
    }
  }

  loadTradingViewScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="https://s3.tradingview.com/tv.js"]`)) {
        resolve();
        return;
      }

      this.scriptElement = document.createElement('script');
      this.scriptElement.src = 'https://s3.tradingview.com/tv.js';
      this.scriptElement.onload = () => resolve();
      this.scriptElement.onerror = (error) => reject(error);
      document.body.appendChild(this.scriptElement);
    });
  }

  initTradingView() {
    if (this.tradingview && TradingView) {
      new TradingView.MediumWidget({
        symbols: [
          ['EURUSD', 'EURUSD|1D'],
          ['USDJPY', 'USDJPY|1D'],
          ['GBPUSD', 'GBPUSD|1D'],
          ['USDCAD', 'USDCAD|1D'],
        ],
        chartOnly: false,
        width: 1100,
        height: 500,
        locale: 'en',
        colorTheme: 'light',
        autosize: false,
        showVolume: false,
        hideDateRanges: false,
        scalePosition: 'right',
        scaleMode: 'Normal',
        fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
        fontSize: '10',
        noTimeScale: false,
        valuesTracking: '1',
        chartType: 'line',
        container_id: 'tradingview_7ab57'
      });
    }
  }

  toggleWidget() {
    this.showWidget = !this.showWidget;
    if (this.showWidget) {
      this.loadTradingViewScript().then(() => {
        this.initTradingView();
      }).catch(error => {
        console.error('Error loading TradingView script', error);
      });
    } else {
      // Optionally clear the widget container when hidden
      if (this.tradingview) {
        this.tradingview.nativeElement.innerHTML = '';
      }
    }
    console.log('Toggle widget method called');
  }
}
