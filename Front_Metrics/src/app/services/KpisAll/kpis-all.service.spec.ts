import { TestBed } from '@angular/core/testing';

import { KpisAllService } from './kpis-all.service';

describe('KpisAllService', () => {
  let service: KpisAllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpisAllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
