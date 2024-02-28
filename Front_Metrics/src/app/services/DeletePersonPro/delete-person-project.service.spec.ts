import { TestBed } from '@angular/core/testing';

import { DeletePersonProjectService } from './delete-person-project.service';

describe('DeletePersonProjectService', () => {
  let service: DeletePersonProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeletePersonProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
