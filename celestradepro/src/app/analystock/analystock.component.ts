import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar.service';
import { UserService } from 'src/app/services/user.service'; // Import UserService
import { Chart } from 'chart.js';

@Component({
  selector: 'app-analystock',
  templateUrl: './analystock.component.html',
  styleUrls: ['./analystock.component.scss'],
})
export class AnalystockComponent implements OnInit {
  details: any[] = [];
  chart: any;
  uniqueYears: string[] = [];
  selectedYears: { [key: string]: boolean } = {};
  selectedSymbols: string[] = []; // Store selected symbols

  constructor(
    private calendarService: CalendarService,
    private userService: UserService // Inject UserService
  ) {}

  ngOnInit() {
    this.checkLoginStatus(); // Check login status on init
  }

  checkLoginStatus(): void {
    const email = this.userService.getEmail(); // Get the user's email from the service
    if (email) {
      this.fetchUserSymbols(); // Fetch user's symbols if logged in
    } else {
      this.fetchDefaultProfile(); // Fetch default profile if not logged in
    }
  }

  fetchUserSymbols(): void {
    const email = this.userService.getEmail(); // Get the user's email from the service
    this.userService.getWatchlist(email).subscribe(
      (response: any) => {
        this.selectedSymbols = response.watchlist.map((item: any) => item.symbol);
        if (this.selectedSymbols.length > 0) {
          this.fetchDataAndGenerateChart();
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

  fetchDefaultProfile(): void {
    this.calendarService.getFinancialData().subscribe(
      (data: any) => {
        if (data.length > 0) {
          const firstSymbol = data[0].ticker; // Get the first symbol from the data
          this.selectedSymbols = [firstSymbol];
          this.details = data.filter((item: any) => this.selectedSymbols.includes(item.ticker));
          this.updateUniqueYears();
          this.initializeSelectedYears();
          this.generateChart();
          this.updateChart('2023'); // Select 2023 by default
        } else {
          console.log('No financial data available.');
          // Handle the case where no financial data is available
        }
      },
      error => {
        console.error('Error fetching default profile data:', error);
      }
    );
  }

  fetchDataAndGenerateChart(): void {
    this.calendarService.getFinancialData().subscribe(
      (data: any) => {
        // Filter financial data to include only the symbols in the user's watchlist
        this.details = data.filter((item: any) => this.selectedSymbols.includes(item.ticker));
        this.updateUniqueYears();
        this.initializeSelectedYears();
        this.generateChart();
        this.updateChart('2023'); // Select 2023 by default
      },
      error => {
        console.log(error);
      }
    );
  }

  updateUniqueYears(): void {
    const allYears = this.details.reduce((years, company) => {
      company.financials.forEach(financial => {
        years.add(financial.year.toString());
      });
      return years;
    }, new Set<string>());

    this.uniqueYears = Array.from(allYears);
  }

  initializeSelectedYears(): void {
    this.uniqueYears.forEach(year => {
      this.selectedYears[year] = (year === '2023'); // Default selection for 2023
    });
  }

  updateChart(selectedYear: string): void {
    this.uniqueYears.forEach(year => {
      if (year !== selectedYear) {
        this.selectedYears[year] = false; // Deselect other years
      }
    });

    const { symbols, years, profitData, revenueData, netWorthData } = this.prepareChartData();
    this.chart.data.labels = symbols; // Update x-axis labels with selected stock symbols
    this.chart.data.datasets[0].data = profitData;
    this.chart.data.datasets[1].data = revenueData;
    this.chart.data.datasets[2].data = netWorthData;
    this.chart.update();
  }

  generateChart(): void {
    const { years, profitData, revenueData, netWorthData } = this.prepareChartData();

    this.chart = new Chart('financialChart', {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Profit',
            data: profitData,
            backgroundColor: 'rgba(241, 196, 15, 0.8)',
            borderColor: 'rgba(241, 196, 15, 1)',
            borderWidth: 1
          },
          {
            label: 'Revenue',
            data: revenueData,
            backgroundColor: 'rgba(52, 152, 219, 0.8)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1
          },
          {
            label: 'Net Worth',
            data: netWorthData,
            backgroundColor: 'rgba(46, 204, 113, 0.8)',
            borderColor: 'rgba(46, 204, 113, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function(value: number) {
                return (value / 10000000).toFixed(2) + ' Cr'; // Convert to crores and append ' Cr'
              }
            }
          }]
        }
      }
    });
  }

  prepareChartData(): { symbols: string[], years: string[], profitData: number[], revenueData: number[], netWorthData: number[] } {
    const selectedYears = Object.keys(this.selectedYears).filter(year => this.selectedYears[year]);
    const symbols: string[] = [];
    const years: string[] = [];
    const profitData: number[] = [];
    const revenueData: number[] = [];
    const netWorthData: number[] = [];

    selectedYears.forEach(selectedYear => {
      const filteredDetails = this.details.filter(company =>
        company.financials.some(financial => financial.year.toString() === selectedYear)
      );

      filteredDetails.forEach(company => {
        if (!symbols.includes(company.ticker)) {
          symbols.push(company.ticker);
        }
        years.push(selectedYear);

        const yearFinancials = company.financials.find(financial => financial.year.toString() === selectedYear);
        profitData.push(yearFinancials ? yearFinancials.profit : 0);
        revenueData.push(yearFinancials ? yearFinancials.revenue : 0);
        netWorthData.push(yearFinancials ? yearFinancials.net_worth : 0);
      });
    });

    return { symbols, years, profitData, revenueData, netWorthData };
  }
}
