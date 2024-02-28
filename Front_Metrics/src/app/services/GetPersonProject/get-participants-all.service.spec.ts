import { TestBed } from '@angular/core/testing';

import { GetParticipantsAllService } from './get-participants-all.service';

describe('GetParticipantsAllService', () => {
  let service: GetParticipantsAllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetParticipantsAllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
