import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-optiongainers',
  templateUrl: './optiongainers.component.html',
  styleUrls: ['./optiongainers.component.scss'],
})
export class OptiongainersComponent implements OnInit {

  optionsData: any;
  optionsDataArray: any[] = [];  // Initialize as an empty array

  colorScheme = {
    domain: ['#5AA454']
  };

  oiLosersColorScheme = {
    domain: ['#ef5b5b']  // Red color scheme for OI Losers
  };
  barPadding = 30;  // Reduced bar padding


  constructor() { }

  ngOnInit(): void {
    this.fetchOptionsData();
    this.prepareChartData();
  }

  fetchOptionsData() {
    this.optionsData = {
      mostActiveCalls: [
        { name: 'NIFTY 25000', value: 74387 },
        { name: 'NIFTY 24600', value: 66849 },
        { name: 'NIFTY 24500', value: 66227 },
        { name: 'HCLTECH 1600', value: 62853 },
        { name: 'NIFTY 26000', value: 40538 }
      ],
      contractGainersCalls: [
        { name: 'OFSS 12100', value: 53400 },
        { name: 'MRF 134000', value: 34600 },
        { name: 'INDIAMART 2940', value: 30200 },
        { name: 'LALPATHLAB 3250', value: 18075 },
        { name: 'AUROPHARMA 1520', value: 12211 }
      ],
      mostActivePuts: [
        { name: 'NIFTY 24500', value: 81172 },
        { name: 'NIFTY 24000', value: 65987 },
        { name: 'NIFTY 24600', value: 52489 },
        { name: 'NIFTY 23500', value: 46444 },
        { name: 'NIFTY 24400', value: 35493 }
      ],
      contractGainersPuts: [
        { name: 'LALPATHLAB 3100', value: 17100 },
        { name: 'MRF 133500', value: 12600 },
        { name: 'LALPATHLAB 3000', value: 8500 },
        { name: 'APOLLOTYRE 555', value: 8400 },
        { name: 'HCLTECH 1720', value: 7700 }
      ],
      oiGainersCalls: [
        { name: 'INDIAMART 2940', value: 18900 },
        { name: 'OFSS 12100', value: 16700 },
        { name: 'LALPATHLAB 3250', value: 4700 },
        { name: 'MRF 134000', value: 1620 },
        { name: 'ITC 520', value: 1366 }
      ],
      oiLosersCalls: [
        { name: 'ALKEM 5250', value: -68.84 },
        { name: 'MRF 131500', value: -68.75 },
        { name: 'MRF 130500', value: -65.83 },
        { name: 'PETRONET 342', value: -60.94 },
        { name: 'ABBOTINDIA 27500', value: -58.93 }
      ],
      oiGainersPuts: [
        { name: 'OFSS 10800', value: 6333.33 },
        { name: 'MRF 133500', value: 2950 },
        { name: 'HCLTECH 1620', value: 2052 },
        { name: 'PIDILITIND 3040', value: 1900 },
        { name: 'AUROPHARMA 1360', value: 1621 }
      ],
      oiLosersPuts: [
        { name: 'PETRONET 312', value: -58.82 },
        { name: 'APOLLOTYRE 465', value: -53.33 },
        { name: 'EXIDEIND 630', value: -50.00 },
        { name: 'HDFCLIFE 555', value: -50.00 },
        { name: 'LTIM 4950', value: -47.27 }
      ]
    };
  }

  prepareChartData() {
    if (this.optionsData) {
      this.optionsDataArray = [
        { data: this.optionsData.mostActiveCalls, xLabel: 'Volume', yLabel: 'Call Options', colorScheme: this.colorScheme },
        { data: this.optionsData.contractGainersCalls, xLabel: 'Volume', yLabel: 'Contract Gainers Calls', colorScheme: this.colorScheme },
        { data: this.optionsData.mostActivePuts, xLabel: 'Volume', yLabel: 'Put Options', colorScheme: this.colorScheme },
        { data: this.optionsData.contractGainersPuts, xLabel: 'Volume', yLabel: 'Contract Gainers Puts', colorScheme: this.colorScheme },
        { data: this.optionsData.oiGainersCalls, xLabel: 'Volume', yLabel: 'OI Gainers Calls', colorScheme: this.colorScheme },
        { data: this.optionsData.oiLosersCalls, xLabel: 'Volume', yLabel: 'OI Losers Calls', colorScheme: this.oiLosersColorScheme },
        { data: this.optionsData.oiGainersPuts, xLabel: 'Volume', yLabel: 'OI Gainers Puts', colorScheme: this.colorScheme },
        { data: this.optionsData.oiLosersPuts, xLabel: 'Volume', yLabel: 'OI Losers Puts', colorScheme: this.oiLosersColorScheme }
      ];
    }
  }
}
