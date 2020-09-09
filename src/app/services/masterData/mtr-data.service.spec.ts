import { TestBed } from '@angular/core/testing';

import { MtrDataService } from './mtr-data.service';

describe('MtrDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MtrDataService = TestBed.get(MtrDataService);
    expect(service).toBeTruthy();
  });
});
