import { TestBed } from '@angular/core/testing';

import { CreatenewProjectService } from './createnew-project.service';

describe('CreatenewProjectService', () => {
  let service: CreatenewProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatenewProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
