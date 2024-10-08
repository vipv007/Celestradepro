import { TestBed } from '@angular/core/testing';

import { ShareholderService } from './shareholder.service';

describe('ShareholderService', () => {
  let service: ShareholderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareholderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
