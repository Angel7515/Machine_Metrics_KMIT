import { TestBed } from '@angular/core/testing';

import { GetPerformanceService } from './get-performance.service';

describe('GetPerformanceService', () => {
  let service: GetPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
