import { TestBed } from '@angular/core/testing';

import { GraphCalcService } from './graph-calc.service';

describe('GraphCalcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphCalcService = TestBed.get(GraphCalcService);
    expect(service).toBeTruthy();
  });
});
