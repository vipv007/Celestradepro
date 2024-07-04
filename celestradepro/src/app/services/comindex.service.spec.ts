import { TestBed } from '@angular/core/testing';

import { ComindexService } from './comindex.service';

describe('ComindexService', () => {
  let service: ComindexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComindexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
