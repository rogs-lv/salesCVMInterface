import { TestBed, async, inject } from '@angular/core/testing';

import { Auth.GuardsGuard } from './auth.guards.guard';

describe('Auth.GuardsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Auth.GuardsGuard]
    });
  });

  it('should ...', inject([Auth.GuardsGuard], (guard: Auth.GuardsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
