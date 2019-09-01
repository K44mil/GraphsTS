import { TestBed } from '@angular/core/testing';

import { GraphDrawService } from './graph-draw.service';

describe('GraphDrawService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphDrawService = TestBed.get(GraphDrawService);
    expect(service).toBeTruthy();
  });
});
