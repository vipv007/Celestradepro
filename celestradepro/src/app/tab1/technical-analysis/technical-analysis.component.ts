import { Component, OnInit } from '@angular/core';
import { TechnicalService } from '../../services/technical.service';

@Component({
  selector: 'app-technical-analysis',
  templateUrl: './technical-analysis.component.html',
  styleUrls: ['./technical-analysis.component.scss'],
})
export class TechnicalAnalysisComponent implements OnInit {

  technicalIndicators: any[] = [];
  movingAverages: any[] = [];

  constructor(private technicalService: TechnicalService) { }

  ngOnInit(): void {
    this.technicalService.getTechnical().subscribe(data => {
      this.technicalIndicators = data.filter(indicator => indicator.Type === 'Indicator');
      this.movingAverages = data.filter(indicator => indicator.Type === 'Average');
    });
  }
}
