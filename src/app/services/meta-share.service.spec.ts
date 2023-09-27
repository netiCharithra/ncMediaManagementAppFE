import { TestBed } from '@angular/core/testing';

import { MetaShareService } from './meta-share.service';

describe('MetaShareService', () => {
  let service: MetaShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
