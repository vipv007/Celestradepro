import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { OptionsService } from '../services/options.service';
import { OptionsChainService } from '../services/optionschain.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  options: any[] = [];
  optionschain: any;
  clickedOptions: string;
  selectTabs = 'recent';
  index = 0;
  private intervalId: any;
  filtered: any = {}; // Initialize filtered object to avoid undefined error

  constructor(
    private optionsService: OptionsService,
    private router: Router,
    private optionschainService: OptionsChainService
  ) {}

  ngOnInit() {
    this.loadOptions();
    this.loadOptionsChain();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadOptions() {
    this.optionsService.getOptions().subscribe((options: any[]) => {
      this.options = options;
    });
  }

  loadOptionsChain() {
    this.optionschainService.getoptions().subscribe((optionschain: any[]) => {
      this.optionschain = optionschain;
      console.log(this.optionschain);
    });
  }

  stopAutoReload() {
    clearInterval(this.intervalId);
  }

  resetIndex() {
    this.index = 0;
  }

  updateLastUpdatedTime() {
    const currentTime = new Date();
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
      lastUpdatedElement.innerText = currentTime.toISOString(); // Update the last updated time on the page
    }
  }

  getStrikeColor(callStrike: number, putStrike: number, type: string): string {
    if (callStrike > putStrike) {
      return type === 'call' ? 'green' : 'red'; // Higher value, apply green for call and red for put
    } else if (callStrike < putStrike) {
      return type === 'call' ? 'red' : 'green'; // Lower value, apply red for call and green for put
    } else {
      return 'blue'; // Same value, apply blue
    }
  }

  getLastPriceColor(callLastPrice: number, putLastPrice: number, type: string): string {
    if (callLastPrice > putLastPrice) {
      return type === 'call' ? 'green' : 'red'; // Higher value, apply green for call and red for put
    } else if (callLastPrice < putLastPrice) {
      return type === 'call' ? 'red' : 'green'; // Lower value, apply red for call and green for put
    } else {
      return 'blue'; // Same value, apply blue
    }
  }

  setClickedOptions(symbol: string) {
    this.clickedOptions = symbol;
    console.log('Clicked Options:', this.clickedOptions);
    this.selectTabs = 'missed';
    this.router.navigate(['/tabs/tab2'], { queryParams: { symbol } });
  }
}
