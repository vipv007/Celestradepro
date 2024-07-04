/*import { Component, OnInit, AfterViewInit, Renderer2, ElementRef } from '@angular/core';

// Import TradingView library
declare const TradingView: any;

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
})
export class HeatmapComponent  {
  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.loadTradingViewWidget();
  }

  private loadTradingViewWidget() {
    // Create the container div
    const container = this.renderer.createElement('div');
    container.classList.add('tradingview-widget-container');

    // Create the inner widget div
    const widgetDiv = this.renderer.createElement('div');
    widgetDiv.classList.add('tradingview-widget-container__widget');
    this.renderer.appendChild(container, widgetDiv);

    // Create the copyright div
    const copyrightDiv = this.renderer.createElement('div');
    copyrightDiv.classList.add('tradingview-widget-copyright');
    const link = this.renderer.createElement('a');
    this.renderer.setAttribute(link, 'href', 'https://www.tradingview.com/');
    this.renderer.setAttribute(link, 'rel', 'noopener nofollow');
    this.renderer.setAttribute(link, 'target', '_blank');
    const span = this.renderer.createElement('span');
    span.classList.add('blue-text');
    const text = this.renderer.createText('Track all markets on TradingView');
    this.renderer.appendChild(span, text);
    this.renderer.appendChild(link, span);
    this.renderer.appendChild(copyrightDiv, link);
    this.renderer.appendChild(container, copyrightDiv);

    // Create the script element for the TradingView widget
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
    script.async = true;
    script.text = `
      {
        "exchanges": [],
        "dataSource": "SPX500",
        "grouping": "sector",
        "blockSize": "market_cap_basic",
        "blockColor": "change",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "light",
        "hasTopBar": false,
        "isDataSetEnabled": false,
        "isZoomEnabled": true,
        "hasSymbolTooltip": true,
        "isMonoSize": false,
        "width": "1O00px",
        "height": "1O0%"
      }
    `;
    this.renderer.appendChild(container, script);

    // Append the container div to the component's native element
    this.renderer.appendChild(this.el.nativeElement, container);
  }

}*/

import { Component, OnInit } from '@angular/core';
import { TrendsService } from '../../services/trends.service';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
})
export class HeatmapComponent implements OnInit {
  data: any[] = [];  // Initialize as an empty array
  activeTab: string = 'price';

  constructor(private trendsService: TrendsService) { }

  ngOnInit(): void {
    this.getAllTrends();
  }

  getAllTrends(): void {
    this.trendsService.getAllTrends().subscribe(
      (response: any[]) => {  // Expect response to be an array
        this.data = response;
        console.log(this.data);
      },
      (error) => {
        console.error('Error fetching trends data', error);
      }
    );
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /*getColor(change: number): string {
    if (change > 0) {
      let intensity = Math.min(change / 5, 1);  // Cap intensity at 1 for 5% change
      return `rgba(0, 255, 0, ${intensity})`;  // Green for positive
    } else if (change < 0) {
      let intensity = Math.min(-change / 5, 1);  // Cap intensity at 1 for -5% change
      return `rgba(255, 0, 0, ${intensity})`;  // Red for negative
    } else {
      return 'rgba(200, 200, 200, 0.5)';  // Grey for zero
    }
  }

  getTextColor(change: number): string {
    return change > 0 ? '#333' : '#444';
  }*/
}
