import { Injectable } from '@angular/core';
import axios from 'axios';
import { SMA } from 'technicalindicators';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private apiUrl = 'http://localhost:3000/api/data';

  constructor() {}

  async getStockData() {
    try {
      const response = await axios.get(this.apiUrl);
      const allStockData = response.data;

      if (!Array.isArray(allStockData)) {
        console.error('Unexpected response structure:', allStockData);
        return null;
      }

      // Find the MSFT stock data
      const msftStock = allStockData.find((stock: any) => stock.symbol === 'MSFT');
      if (msftStock && msftStock.stock) {
        const stockData = msftStock.stock;
        const dates = stockData.map((data: any) => new Date(data.date));
        const closePrices = stockData.map((data: any) => data.close);

        console.log("Fetched dates:", dates);
        console.log("Fetched close prices:", closePrices);

        return { dates, closePrices };
      } else {
        console.error('MSFT stock data not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return null;
    }
  }

  calculateSMA(closePrices: number[], length: number) {
    return SMA.calculate({ period: length, values: closePrices });
  }
}
