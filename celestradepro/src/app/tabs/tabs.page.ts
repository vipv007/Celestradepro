import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  currentTab: string = 'tab1'; // Default tab

  constructor() {}

  tabChanged(event: any) {
    this.currentTab = event.tab;
  }
}
