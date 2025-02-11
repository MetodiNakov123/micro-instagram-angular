import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { validIdGuard } from './valid-id.guard';

describe('validIdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => validIdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
