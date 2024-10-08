import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comtechnical',
  templateUrl: './comtechnical.component.html',
  styleUrls: ['./comtechnical.component.scss'],
})
export class ComtechnicalComponent {
  
  constructor() { }

  ngAfterViewInit(): void {
    this.loadTradingViewScript('MCX:CRUDEOIL1!', 'crude-oil-widget');
    this.loadTradingViewScript('MCX:SILVER1!', 'silver-widget');
    this.loadTradingViewScript('MCX:GOLD1!', 'gold-widget');
  }

  loadTradingViewScript(symbol: string, containerId: string): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.innerHTML = `
    {
      "interval": "1D",
      "width": 425,
      "isTransparent": false,
      "height": 450,
      "symbol": "${symbol}",
      "showIntervalTabs": true,
      "displayMode": "single",
      "locale": "en",
      "colorTheme": "light"
    }
    `;
    document.getElementById(containerId).appendChild(script);
  }
}


//   data = [
//     {
//       name: 'Gold',
//       movingAverages: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Buy', hourly: 'Buy', daily: 'Buy' },
//       indicators: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Strong Buy', hourly: 'Buy', daily: 'Strong Buy' },
//       summary: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Strong Buy', hourly: 'Buy', daily: 'Strong Buy' }
//     },
//     {
//       name: 'Silver',
//       movingAverages: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Strong Buy', hourly: 'Strong Buy', daily: 'Strong Buy' },
//       indicators: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Strong Buy', hourly: 'Strong Buy', daily: 'Strong Buy' },
//       summary: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Strong Buy', hourly: 'Strong Buy', daily: 'Strong Buy' }
//     },
//     {
//       name: 'Copper',
//       movingAverages: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Strong Buy', hourly: 'Buy', daily: 'Strong Buy' },
//       indicators: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Sell', hourly: 'Buy', daily: 'Strong Buy' },
//       summary: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Neutral', hourly: 'Buy', daily: 'Strong Buy' }
//     },
//     {
//       name: 'Crude Oil WTI',
//       movingAverages: { fiveMinutes: 'Buy', fifteenMinutes: 'Sell', hourly: 'Sell', daily: 'Buy' },
//       indicators: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Strong Buy', hourly: 'Strong Sell', daily: 'Strong Buy' },
//       summary: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Neutral', hourly: 'Strong Sell', daily: 'Strong Buy' }
//     },
//     {
//       name: 'Brent Oil',
//       movingAverages: { fiveMinutes: 'Neutral', fifteenMinutes: 'Sell', hourly: 'Sell', daily: 'Buy' },
//       indicators: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Strong Buy', hourly: 'Strong Sell', daily: 'Neutral' },
//       summary: { fiveMinutes: 'Buy', fifteenMinutes: 'Neutral', hourly: 'Strong Sell', daily: 'Neutral' }
//     },
//     {
//       name: 'Natural Gas',
//       movingAverages: { fiveMinutes: 'Strong Sell', fifteenMinutes: 'Strong Sell', hourly: 'Strong Sell', daily: 'Strong Sell' },
//       indicators: { fiveMinutes: 'Strong Sell', fifteenMinutes: 'Strong Sell', hourly: 'Strong Sell', daily: 'Strong Sell' },
//       summary: { fiveMinutes: 'Strong Sell', fifteenMinutes: 'Strong Sell', hourly: 'Strong Sell', daily: 'Strong Sell' }
//     },
//     {
//       name: 'US Wheat',
//       movingAverages: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Buy', hourly: 'Sell', daily: 'Strong Sell' },
//       indicators: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Strong Buy', hourly: 'Buy', daily: 'Strong Sell' },
//       summary: { fiveMinutes: 'Strong Buy', fifteenMinutes: 'Strong Buy', hourly: 'Neutral', daily: 'Strong Sell' }
//     }
//   ];

//   technicalIndicators = [
//     { name: 'RSI(14)', value: '59.950', action: 'Buy' },
//     { name: 'STOCH(9,6)', value: '60.098', action: 'Buy' },
//     { name: 'STOCHRSI(14)', value: '100.000', action: 'Overbought' },
//     { name: 'MACD(12,26)', value: '1.340', action: 'Buy' },
//     { name: 'ADX(14)', value: '36.931', action: 'Buy' },
//     { name: 'Williams %R', value: '-15.918', action: 'Overbought' },
//     { name: 'CCI(14)', value: '195.2380', action: 'Buy' },
//     { name: 'ATR(14)', value: '2.8536', action: 'Less Volatility' },
//     { name: 'Highs/Lows(14)', value: '3.6286', action: 'Buy' },
//     { name: 'Ultimate Oscillator', value: '59.250', action: 'Buy' },
//     { name: 'ROC', value: '0.405', action: 'Buy' },
//     { name: 'Bull/Bear Power(13)', value: '9.9900', action: 'Buy' }
//   ];

//   getSummaryClass(summary: string): string {
//     if (summary === 'Buy' || summary === 'Strong Buy') {
//       return 'buy';
//     } else if (summary === 'Sell' || summary === 'Strong Sell') {
//       return 'sell';
//     } else {
//       return '';
//     }
//   }
// }
