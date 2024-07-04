import { TestBed } from '@angular/core/testing';

import { FrxindexService } from './frxindex.service';

describe('FrxindexService', () => {
  let service: FrxindexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrxindexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
