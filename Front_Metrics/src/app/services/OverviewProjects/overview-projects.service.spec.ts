import { TestBed } from '@angular/core/testing';

import { OverviewProjectsService } from './overview-projects.service';

describe('OverviewProjectsService', () => {
  let service: OverviewProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverviewProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
