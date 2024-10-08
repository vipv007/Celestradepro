import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topnews',
  templateUrl: './topnews.component.html',
  styleUrls: ['./topnews.component.scss'],
})
export class TopnewsComponent {

  ngAfterViewInit(): void {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "feedMode": "all_symbols",
      "isTransparent": false,
      "displayMode": "regular",
      "width": 350,
      "height": 330,
      "colorTheme": "light",
      "locale": "en"
    });
    
    document.getElementById('tradingview-widget')?.appendChild(script);
  }
}