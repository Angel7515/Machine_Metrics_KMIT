import { TestBed } from '@angular/core/testing';

import { AuthServiceTokenService } from './auth-service-token.service';

describe('AuthServiceTokenService', () => {
  let service: AuthServiceTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthServiceTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
