import { TestBed } from '@angular/core/testing';

import { DbKpisPersonService } from './db-kpis-person.service';

describe('DbKpisPersonService', () => {
  let service: DbKpisPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbKpisPersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
