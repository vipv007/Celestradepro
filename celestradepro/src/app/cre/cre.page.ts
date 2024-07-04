import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-cre',
  templateUrl: './cre.page.html',
  styleUrls: ['./cre.page.scss'],
})
export class CrePage implements  AfterViewInit {

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.loadTradingViewWidget();
  }

  loadTradingViewWidget() {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = `
      {
        "width": "100%",
        "height": "400",
        "locale": "en",
        "importanceFilter": "-1,0,1"
      }
    `;

    const container = this.elRef.nativeElement.querySelector('#tradingview-widget');
    this.renderer.appendChild(container, script);
  }
}
