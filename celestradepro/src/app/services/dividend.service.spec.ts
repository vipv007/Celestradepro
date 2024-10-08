import { TestBed } from '@angular/core/testing';

import { DividendService } from './dividend.service';

describe('DividendService', () => {
  let service: DividendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DividendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
