import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent {

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
        "width": "350",
        "height": "330",
        "locale": "en",
        "importanceFilter": "-1,0,1"
      }
    `;

    const container = this.elRef.nativeElement.querySelector('#tradingview-widget');
    this.renderer.appendChild(container, script);
  }
}
