import { TestBed } from '@angular/core/testing';

import { HttpLayerService } from './http-layer.service';

describe('HttpLayerService', () => {
  let service: HttpLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
