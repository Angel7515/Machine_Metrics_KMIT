import { TestBed } from '@angular/core/testing';

import { UPloadProjectService } from './upload-project.service';

describe('UPloadProjectService', () => {
  let service: UPloadProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UPloadProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
