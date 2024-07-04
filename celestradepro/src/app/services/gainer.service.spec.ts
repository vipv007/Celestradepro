import { TestBed } from '@angular/core/testing';

import { GainerService } from './gainer.service';

describe('GainerService', () => {
  let service: GainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
