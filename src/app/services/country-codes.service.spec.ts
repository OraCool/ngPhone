import { TestBed } from '@angular/core/testing';

import { CountryCodesService } from './country-codes.service';

describe('CountryCodesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CountryCodesService = TestBed.get(CountryCodesService);
    expect(service).toBeTruthy();
  });
});
