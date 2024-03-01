import { TestBed } from '@angular/core/testing';

import { UpdateKPIService } from './update-kpi.service';

describe('UpdateKPIService', () => {
  let service: UpdateKPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateKPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
