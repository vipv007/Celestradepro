import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  cards: { originalName: string, name: string, route: string }[] = [
    { originalName: 'Stocks', name: 'Stocks', route: 'trading' },
    { originalName: 'Options', name: 'Options', route: 'bill' },
    { originalName: 'Forex', name: 'Forex', route: 'widget' },
    { originalName: 'Commodity', name: 'Commodity', route: 'commodity' },
    { originalName: 'Portfolio', name: 'Portfolio', route: 'portfolio' },
    { originalName: 'News', name: 'News', route: 'news' },
    // Add more cards as needed
  ];

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    // Load saved names and routes for each card
    this.cards.forEach(card => {
      const savedName = this.settingsService.getNameForCard(card.originalName);
      const savedRoute = this.settingsService.getRouteForCard(card.originalName);
      if (savedName) {
        card.name = savedName;
      }
      if (savedRoute) {
        card.route = savedRoute;
      }
    });
  }

  saveCardChanges() {
    this.cards.forEach(card => {
      this.settingsService.setNameForCard(card.originalName, card.name);
      this.settingsService.setRouteForCard(card.originalName, card.route);
    });
  }

  onRouteChange(card: { originalName: string, name: string, route: string }, event: any) {
    card.route = event.detail.value;
  }

  onNameChange(card: { originalName: string, name: string, route: string }, event: any) {
    card.name = event.detail.value;
  }
}
