import { Component, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
})
export class StudentPage implements AfterViewInit {

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.loadStockComparisonWidget();
    this.loadStocksAnalystRatingComparisonWidget();
  }

  private loadStockComparisonWidget(): void {
    const symbolElements = document.getElementsByClassName("stocks-return-comparison");
    const singleTickerElements = document.getElementsByClassName("sta-stocks-return-comparison-display");

    for (let i = 0; i < symbolElements.length; i++) {
      const symbolElement = symbolElements[i];
      const singleTickerElement = singleTickerElements[i];

      const iWidth = this.getAttributeValue(symbolElement, 'data-width', 600);
      let iHeight = this.getAttributeValue(symbolElement, 'data-height', 700);
      const iTheme = this.getAttributeValue(symbolElement, 'data-theme', 'wt_bg_light');
      const iuid = this.getAttributeValue(symbolElement, 'data-uid', '103363042966961595bf30b66961595bf30c');
      const iStocks = this.getAttributeValue(symbolElement, 'data-stocks', 'AMZN,GOOGL,META,MSFT,NVDA,AAPL');
      const iStocksArr = iStocks.split(',');

      iHeight = Math.max(150, Math.min(iHeight, 700));
      const tabHeight = iHeight - 115;

      const iframe = this.renderer.createElement('iframe');
      iframe.setAttribute('src', `https://www.stocktargetadvisor.com/widget/stocks-return-comparison-widget/${iTheme}/${iuid}?symbols=${iStocksArr}&tab_height=${tabHeight}`);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('width', `${iWidth}px`);
      iframe.setAttribute('height', `${iHeight}px`);
      iframe.setAttribute('scrolling', 'auto');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('class', iTheme);

      if (iTheme !== 'wt_bg_trans') {
        iframe.setAttribute('style', 'background: url(https://www.stocktargetadvisor.com/assets/images/rolling_loader.gif) no-repeat center center; background-size: 50px 50px;');
      }

      if (!singleTickerElement.innerHTML.includes('iframe')) {
        this.renderer.appendChild(singleTickerElement, iframe);
      }
    }
  }

  private loadStocksAnalystRatingComparisonWidget(): void {
    const symbolElements = document.getElementsByClassName("stocks-analyst-rating-comparison");
    const singleTickerElements = document.getElementsByClassName("sta-stocks-analyst-rating-comparison-display");

    for (let i = 0; i < symbolElements.length; i++) {
      const symbolElement = symbolElements[i];
      const singleTickerElement = singleTickerElements[i];

      const iWidth = this.getAttributeValue(symbolElement, 'data-width', 600);
      let iHeight = this.getAttributeValue(symbolElement, 'data-height', 700);
      const iTheme = this.getAttributeValue(symbolElement, 'data-theme', 'wt_bg_light');
      const iuid = this.getAttributeValue(symbolElement, 'data-uid', '19716959096698f514ec20c6698f514ec20e');
      const iStocks = this.getAttributeValue(symbolElement, 'data-stocks', 'AAPL,AMZN,CCA:CA,CHR:CA,DE:CA,GOOGL,INTC,META,MSFT,NVDA');
      const iStocksArr = iStocks.split(',');

      iHeight = Math.max(150, Math.min(iHeight, 700));
      const tabHeight = iHeight - 115;

      const iframe = this.renderer.createElement('iframe');
      iframe.setAttribute('src', `https://www.stocktargetadvisor.com/widget/stocks-analyst-rating-comparison-widget/${iTheme}/${iuid}?symbols=${iStocksArr}`);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('width', `${iWidth}px`);
      iframe.setAttribute('height', `${iHeight}px`);
      iframe.setAttribute('scrolling', 'auto');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('class', iTheme);

      if (iTheme !== 'wt_bg_trans') {
        iframe.setAttribute('style', 'background: url(https://www.stocktargetadvisor.com/assets/images/rolling_loader.gif) no-repeat center center; background-size: 50px 50px;');
      }

      if (!singleTickerElement.innerHTML.includes('iframe')) {
        this.renderer.appendChild(singleTickerElement, iframe);
      }
    }
  }

  private getAttributeValue(element: Element, attributeName: string, defaultValue: any): any {
    const value = element.getAttribute(attributeName);
    return value ? value : defaultValue;
  }
}
