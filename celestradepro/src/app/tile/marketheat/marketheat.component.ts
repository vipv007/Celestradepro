import { Component, OnInit } from '@angular/core';
import { TrendsService } from '../../services/trends.service';

@Component({
  selector: 'app-marketheat',
  templateUrl: './marketheat.component.html',
  styleUrls: ['./marketheat.component.scss'],
})
export class MarketheatComponent implements OnInit {
  data: any[] = [];  // Initialize as an empty array
  activeTab: string = 'price';

  constructor(private trendsService: TrendsService) { }

  ngOnInit(): void {
    this.getAllTrends();
  }

  getAllTrends(): void {
    this.trendsService.getAllTrends().subscribe(
      (response: any[]) => {  // Expect response to be an array
        // Filter only commodities of type "Commodity"
        this.data = response.filter(item => item.Type === 'Commodity');
        console.log(this.data);
      },
      (error) => {
        console.error('Error fetching trends data', error);
      }
    );
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
