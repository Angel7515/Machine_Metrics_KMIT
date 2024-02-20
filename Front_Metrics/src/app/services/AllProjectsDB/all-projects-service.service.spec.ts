import { TestBed } from '@angular/core/testing';

import { AllProjectsServiceService } from './all-projects-service.service';

describe('AllProjectsServiceService', () => {
  let service: AllProjectsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllProjectsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
