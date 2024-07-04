import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-crt',
  templateUrl: './crt.page.html',
  styleUrls: ['./crt.page.scss'],
})
export class CrtPage implements AfterViewInit {

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.loadQuotesWidget();
  }

  loadQuotesWidget() {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://c.mql5.com/js/widgets/quotes/widget.js?v=1';
    script.async = true;
    script.setAttribute('data-type', 'quotes-widget');

    const config = {
      type: "overview",
      style: "table",
      filter: ["EURUSD", "USDJPY", "GBPUSD", "AUDUSD", "USDCAD", "USDCHF"],
      width: 700,
      height: 420,
      period: "D1",
      id: "quotesWidgetOverview"
    };

    script.innerHTML = JSON.stringify(config);

    const container = this.elRef.nativeElement.querySelector('#quotesWidgetOverview');
    this.renderer.appendChild(container, script);
  }
}
