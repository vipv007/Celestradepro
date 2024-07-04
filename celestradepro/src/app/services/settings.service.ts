import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private routeKeyPrefix = 'routeForCard_';
  private nameKeyPrefix = 'nameForCard_';

  constructor() {}

  setRouteForCard(cardName: string, route: string) {
    localStorage.setItem(this.routeKeyPrefix + cardName, route);
  }

  getRouteForCard(cardName: string): string | null {
    return localStorage.getItem(this.routeKeyPrefix + cardName);
  }

  setNameForCard(cardName: string, name: string) {
    localStorage.setItem(this.nameKeyPrefix + cardName, name);
  }

  getNameForCard(cardName: string): string | null {
    return localStorage.getItem(this.nameKeyPrefix + cardName);
  }
}
