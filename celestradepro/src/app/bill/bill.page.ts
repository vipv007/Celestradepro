import { Component, OnInit } from '@angular/core';

export interface Segment {
  segment: string;
  sentiment: string;
  netOI: string;
  change: string;
  bearishWidth?: number;
  bullishWidth?: number;
}

export interface SummaryElement {
  participant: string; 
  indexFutures: Segment[];
  indexOptions: Segment[];
}

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
})
export class BillPage implements OnInit {
  dataSource: SummaryElement[] = [];

  data = [
    {
      participant: 'FII',
      indexFutures: [
        { segment: 'NIFTY', sentiment: 'Medium Bullish', netOI: '--', change: '22,475' },
        { segment: 'BANKNIFTY', sentiment: 'Mild Bullish', netOI: '--', change: '639' },
        { segment: 'MIDCPNIFTY', sentiment: 'Mild Bearish', netOI: '--', change: '-946' },
        { segment: 'FINNIFTY', sentiment: 'Mild Bearish', netOI: '--', change: '-47' }
      ],
      indexOptions: [
        { segment: 'Index Options', sentiment: 'Indecisive', netOI: '31,265', change: '90,722' }
      ]
    },
    {
      participant: 'Pro',
      indexFutures: [
        { segment: 'Index Futures', sentiment: 'Indecisive', netOI: '1,750', change: '-3,567' }
      ],
      indexOptions: [
        { segment: 'Call Options', sentiment: 'Indecisive', netOI: '-31,111', change: '4,237' },
        { segment: 'Put Options', sentiment: 'Medium Bearish', netOI: '3,572', change: '2.86L' }
      ]
    },
    {
      participant: 'Client',
      indexFutures: [
        { segment: 'Index Futures', sentiment: 'Medium Bearish', netOI: '-86,509', change: '-18,715' }
      ],
      indexOptions: [
        { segment: 'Call Options', sentiment: 'Indecisive', netOI: '-1.45L', change: '1.86L' },
        { segment: 'Put Options', sentiment: 'Strong Bullish', netOI: '-4.98L', change: '-34,107' }
      ]
    }
  ];

  ngOnInit() {
    this.dataSource = this.data.map(participantData => ({
      participant: participantData.participant,
      indexFutures: participantData.indexFutures.map(segment => ({
        ...segment,
        bearishWidth: this.calculateBearishWidth(segment.sentiment),
        bullishWidth: this.calculateBullishWidth(segment.sentiment)
      })),
      indexOptions: participantData.indexOptions.map(segment => ({
        ...segment,
        bearishWidth: this.calculateBearishWidth(segment.sentiment),
        bullishWidth: this.calculateBullishWidth(segment.sentiment)
      }))
    }));
  }

  calculateBearishWidth(sentiment: string): number {
    switch (sentiment) {
      case 'Strong Bearish': return 100;
      case 'Medium Bearish': return 75;
      case 'Mild Bearish': return 50;
      case 'Indecisive': return 25;
      default: return 0;
    }
  }

  calculateBullishWidth(sentiment: string): number {
    switch (sentiment) {
      case 'Strong Bullish': return 100;
      case 'Medium Bullish': return 75;
      case 'Mild Bullish': return 50;
      case 'Indecisive': return 25;
      default: return 0;
    }
  }
}
