import { TestBed } from '@angular/core/testing';

import { Nifty50Service } from './nifty50.service';

describe('Nifty50Service', () => {
  let service: Nifty50Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nifty50Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
