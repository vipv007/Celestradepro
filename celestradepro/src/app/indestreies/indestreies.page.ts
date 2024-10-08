import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-indestreies',
  templateUrl: './indestreies.page.html',
  styleUrls: ['./indestreies.page.scss'],
})
export class IndestreiesPage implements OnInit {
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    const dukascopyAppletConfig = {
      type: "realtime_sentiment_index",
      params: {
        liquidity: "consumers",
        type: "swfx",
        showPairs: true,
        showCurrencies: true,
        availableInstruments: "l:EUR/USD,GBP/USD,USD/CHF,USD/JPY,AUD/USD,XAU/USD,E_SandP-500,E_Brent",
        availableCurrencies: ["AUD", "CAD", "CHF", "GBP", "JPY", "NZD", "USD", "EUR"],
        headingColor: "#000000",
        dateColor: "#000000",
        bgColor: "#ffffff",
        width: "940",
        height: "535",
        adv: "popup"
      }
    };

    // Create the configuration script
    const configScript = this.renderer.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `DukascopyApplet = ${JSON.stringify(dukascopyAppletConfig)};`;

    // Append the configuration script to the container div
    const container = this.renderer.selectRootElement('#dukascopy-applet-container', true);
    this.renderer.appendChild(container, configScript);

    // Create the core library script
    const coreScript = this.renderer.createElement('script');
    coreScript.type = 'text/javascript';
    coreScript.src = 'https://freeserv-static.dukascopy.com/2.0/core.js';

    // Append the core library script to the container div
    this.renderer.appendChild(container, coreScript);

    // Listen for the core script to load before creating the iframe
    coreScript.onload = () => {
      this.initDukascopyApplet();
    };
  }

  private initDukascopyApplet() {
    const appletConfig = (window as any).DukascopyApplet;
    if (!appletConfig) return;

    const url = this.buildDukascopyUrl(appletConfig);
    this.createIframe(url, appletConfig.params);
  }

  private buildDukascopyUrl(config: any): string {
    const baseUrl = 'https://freeserv.dukascopy.com/2.0/';
    const path = `${config.type}/index`;
    const params = this.httpBuildQuery(config.params);
    return `${baseUrl}?path=${path}&${params}`;
  }

  private createIframe(url: string, params: any) {
    const iframe = this.renderer.createElement('iframe');
    iframe.src = url;
    iframe.style.border = '0';
    iframe.marginWidth = '0';
    iframe.marginHeight = '0';
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.width = params.width || '100%';
    if (params.height) {
      iframe.height = params.height;
    }
    const container = this.renderer.selectRootElement('#dukascopy-applet-container', true);
    this.renderer.appendChild(container, iframe);
  }

  private httpBuildQuery(params: any): string {
    const query = [];
    for (const key in params) {
      if (params[key] !== null) {
        query.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
      }
    }
    return query.join('&');
  }
}