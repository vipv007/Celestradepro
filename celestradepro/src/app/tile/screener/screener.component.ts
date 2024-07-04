import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-screener',
  templateUrl: './screener.component.html',
  styleUrls: ['./screener.component.scss'],
})
export class ScreenerComponent implements AfterViewInit {

   @ViewChild('tradingViewWidget') tradingViewWidget: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '1350',
      height: '600', // Set your desired width and height here
      defaultColumn: 'overview',
      defaultScreen: 'most_capitalized',
      showToolbar: true,
      locale: 'en',
      market: 'china',
      colorTheme: 'light'
    });
    this.tradingViewWidget.nativeElement.appendChild(script);
  }
}
