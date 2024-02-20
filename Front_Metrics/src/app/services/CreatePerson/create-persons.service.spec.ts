import { TestBed } from '@angular/core/testing';

import { CreatePersonsService } from './create-persons.service';

describe('CreatePersonsService', () => {
  let service: CreatePersonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePersonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
