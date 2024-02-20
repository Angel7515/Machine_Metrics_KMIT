import { TestBed } from '@angular/core/testing';

import { IDprojectService } from './idproject.service';

describe('IDprojectService', () => {
  let service: IDprojectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IDprojectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
