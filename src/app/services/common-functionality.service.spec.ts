import { TestBed } from '@angular/core/testing';

import { CommonFunctionalityService } from './common-functionality.service';

describe('CommonFunctionalityService', () => {
  let service: CommonFunctionalityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonFunctionalityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
