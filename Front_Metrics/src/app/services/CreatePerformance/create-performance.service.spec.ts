import { TestBed } from '@angular/core/testing';

import { CreatePerformanceService } from './create-performance.service';

describe('CreatePerformanceService', () => {
  let service: CreatePerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
