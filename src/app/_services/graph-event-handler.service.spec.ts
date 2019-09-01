import { TestBed } from '@angular/core/testing';

import { GraphEventHandlerService } from './graph-event-handler.service';

describe('GraphEventHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphEventHandlerService = TestBed.get(GraphEventHandlerService);
    expect(service).toBeTruthy();
  });
});
