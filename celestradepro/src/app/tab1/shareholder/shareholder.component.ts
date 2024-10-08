import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HolderService } from '../../services/holder.service';
import { UserService } from 'src/app/services/user.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-shareholder',
  templateUrl: './shareholder.component.html',
  styleUrls: ['./shareholder.component.scss'],
})
export class ShareholderComponent implements OnInit {
  companies: string[] = [];
  data: any[] = [];
  selectedSymbols: string[] = [];

  constructor(
    private holderService: HolderService,
    private userService: UserService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus(); // Check login status on init
  }

  checkLoginStatus(): void {
    const email = this.userService.getEmail();
    
    if (email) {
      this.fetchUserSymbols(); // Fetch user's symbols if logged in
    } else {
      this.fetchDefaultData(); // Fetch data for the first symbol if not logged in
    }
  }

  fetchUserSymbols(): void {
    const email = this.userService.getEmail();
    this.userService.getWatchlist(email).subscribe(
      (response: any) => {
        this.selectedSymbols = response.watchlist.map((item: any) => item.symbol);
        if (this.selectedSymbols.length > 0) {
          this.fetchHolderData();
        } else {
          console.log('No symbols selected.');
          // Handle the case where no symbols are selected
        }
      },
      error => {
        console.error('Error fetching user symbols:', error);
      }
    );
  }

  fetchHolderData(): void {
    this.holderService.getHolder().subscribe((data: any[]) => {
      this.data = data.filter((d) => this.selectedSymbols.includes(d.Company));
      this.companies = this.data.map(d => d.Company);
      this.cdr.detectChanges(); // Ensure DOM updates
      this.createCharts();
    });
  }

  fetchDefaultData(): void {
    this.holderService.getHolder().subscribe((data: any[]) => {
      if (data.length > 0) {
        const firstSymbol = data[0].Company; // Get the first symbol from the response
        this.data = data.filter((d) => d.Company === firstSymbol);
        this.companies = [firstSymbol];
        this.cdr.detectChanges(); // Ensure DOM updates
        this.createCharts();
      } else {
        console.log('No shareholder data available.');
        // Handle the case where no data is available
      }
    });
  }

  createCharts(): void {
    this.companies.forEach((company) => {
      const companyData = this.data.find((d) => d.Company === company);
      if (companyData) {
        const labels = [
          'Vanguard Group',
          'BlackRock',
          'Berkshire Hathaway',
          'State Street Corporation',
          'Fidelity Investments'
        ];
        const values = [
          companyData['Vanguard Group'] || 0,
          companyData['BlackRock'] || 0,
          companyData['Berkshire Hathaway'] || 0,
          companyData['State Street Corporation'] || 0,
          companyData['Fidelity Investments'] || 0,
        ];

        // Create and append canvas element
        const canvas = document.createElement('canvas');
        canvas.id = `chart-${company}`;
        const container = document.getElementById(`chart-container-${company}`);
        if (container) {
          container.innerHTML = ''; // Clear previous content
          container.appendChild(canvas);

          // Initialize Chart.js chart
          new Chart(canvas, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [{
                data: values,
                backgroundColor: ['#66FF99', '#66FFE6', '#FFCE56', '#FF6384', '#36A2EB']
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: `${company} Shareholders`
                }
              }
            }
          });
        } else {
          console.error(`Container with ID chart-container-${company} not found.`);
        }
      } else {
        console.warn(`No data found for company: ${company}`);
      }
    });
  }

  getOwnershipPercentage(company: string, shareholder: string): number {
    const companyData = this.data.find(d => d.Company === company);
    return companyData ? (companyData[shareholder] || 0) : 0;
  }
}
