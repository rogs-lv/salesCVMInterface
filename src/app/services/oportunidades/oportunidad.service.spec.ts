import { TestBed } from '@angular/core/testing';

import { OportunidadService } from './oportunidad.service';

describe('OportunidadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OportunidadService = TestBed.get(OportunidadService);
    expect(service).toBeTruthy();
  });
});
