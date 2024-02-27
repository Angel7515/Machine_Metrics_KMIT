import { TestBed } from '@angular/core/testing';

import { SearchOnePersonService } from './search-one-person.service';

describe('SearchOnePersonService', () => {
  let service: SearchOnePersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchOnePersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
