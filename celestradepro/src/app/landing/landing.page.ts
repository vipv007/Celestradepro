import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  cards: { originalName: string, name: string, image: string, route: string }[] = [
    { originalName: 'Stocks', name: 'Stocks', image: 'assets/g1.jpg', route: 'trading' },
    { originalName: 'Options', name: 'Options', image: 'assets/cp.jpg', route: 'bill' },
    { originalName: 'Forex', name: 'Forex', image: 'assets/forex.jpeg', route: 'widget' },
    { originalName: 'Commodity', name: 'Commodity', image: 'assets/commo.jpg', route: 'commodity' },
    { originalName: 'Portfolio', name: 'Portfolio', image: 'assets/contact.jpg', route: 'portfolio' },
    { originalName: 'News', name: 'News', image: 'assets/feature.jpg', route: 'news' },
    // Add more cards as needed
  ];

  constructor(private settingsService: SettingsService, private navCtrl: NavController) {}

  ngOnInit() {
    // Load saved names and routes for each card
    this.cards.forEach(card => {
      const savedRoute = this.settingsService.getRouteForCard(card.originalName);
      const savedName = this.settingsService.getNameForCard(card.originalName);
      if (savedRoute) {
        card.route = savedRoute;
      }
      if (savedName) {
        card.name = savedName;
      }
    });
  }

  navigateTo(route: string) {
    this.navCtrl.navigateForward(route);
  }

  openSettings() {
    this.navCtrl.navigateForward('settings');
  }
}
