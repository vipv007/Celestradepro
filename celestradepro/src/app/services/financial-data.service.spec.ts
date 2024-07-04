import { TestBed } from '@angular/core/testing';

import { FinancialDataService } from './financial-data.service';

describe('FinancialDataService', () => {
  let service: FinancialDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
