import { TestBed } from '@angular/core/testing';

import { CommodityGainerService } from './commodity-gainer.service';

describe('CommodityGainerService', () => {
  let service: CommodityGainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommodityGainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
