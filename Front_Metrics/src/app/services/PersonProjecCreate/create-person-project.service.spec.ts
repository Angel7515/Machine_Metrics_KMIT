import { TestBed } from '@angular/core/testing';

import { CreatePersonProjectService } from './create-person-project.service';

describe('CreatePersonProjectService', () => {
  let service: CreatePersonProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePersonProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
