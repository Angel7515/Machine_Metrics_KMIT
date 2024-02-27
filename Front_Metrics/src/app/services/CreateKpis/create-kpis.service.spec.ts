import { TestBed } from '@angular/core/testing';

import { CreateKpisService } from './create-kpis.service';

describe('CreateKpisService', () => {
  let service: CreateKpisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateKpisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
