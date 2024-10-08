import { Component, OnInit } from '@angular/core';
import { InsiderService } from '../../services/insider.service';

@Component({
  selector: 'app-insider',
  templateUrl: './insider.component.html',
  styleUrls: ['./insider.component.scss'],
})
export class InsiderComponent implements OnInit {

    activeData: any[] = [];
    filteredData: any[] = [];
    paginatedData: any[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 1;
    selectedTransactionType: string = '';  // Default selection
  
    constructor(private insiderService: InsiderService) { }
  
    ngOnInit(): void {
      this.insiderService.getInsider().subscribe((data: any) => {
        this.activeData = data;
        this.filteredData = this.activeData;  // Initially show all data
        this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        this.paginateData();
      });
    }
  
    filterData() {
      // Filter data based on selected transaction type
      if (this.selectedTransactionType) {
        this.filteredData = this.activeData.filter(data => data['Transaction Type'] === this.selectedTransactionType);
      } else {
        this.filteredData = this.activeData;  // Show all if no filter is selected
      }
      this.currentPage = 1;  // Reset to the first page after filtering
      this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
      this.paginateData();
    }
  
    paginateData() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    }
  
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.paginateData();
      }
    }
  
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.paginateData();
      }
    }
  }
  
