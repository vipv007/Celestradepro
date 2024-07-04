import { Component, OnInit } from '@angular/core';
import { OptionsactiveService } from '../../services/optionsactive.service';

@Component({
  selector: 'app-active-options',
  templateUrl: './active-options.component.html',
  styleUrls: ['./active-options.component.scss'],
})
export class ActiveOptionsComponent implements OnInit {

    activeData: any;
    paginatedData: any[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 1;

    constructor(private optionactiveService:  OptionsactiveService) { }
  
    ngOnInit(): void {
      this.optionactiveService.getAllActive().subscribe((data: any) => {
        this.activeData = data;
        console.log( this.activeData);
        this.totalPages = Math.ceil(this.activeData.length / this.itemsPerPage);
        this.paginateData();
      });
    }
  
    paginateData() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedData = this.activeData.slice(startIndex, endIndex);
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
    