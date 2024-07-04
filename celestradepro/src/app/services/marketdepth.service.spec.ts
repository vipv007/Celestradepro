import { TestBed } from '@angular/core/testing';

import { MarketdepthService } from './marketdepth.service';

describe('MarketdepthService', () => {
  let service: MarketdepthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketdepthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
