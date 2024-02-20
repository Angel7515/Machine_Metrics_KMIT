import { TestBed } from '@angular/core/testing';

import { UPdateIDProjectsService } from './update-idprojects.service';

describe('UPdateIDProjectsService', () => {
  let service: UPdateIDProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UPdateIDProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
