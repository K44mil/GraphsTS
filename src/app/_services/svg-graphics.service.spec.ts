import { TestBed } from '@angular/core/testing';

import { SvgGraphicsService } from './svg-graphics.service';

describe('SvgGraphicsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SvgGraphicsService = TestBed.get(SvgGraphicsService);
    expect(service).toBeTruthy();
  });
});
