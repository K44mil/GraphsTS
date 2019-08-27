import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphsBoardComponent } from './graphs-board.component';

describe('GraphsBoardComponent', () => {
  let component: GraphsBoardComponent;
  let fixture: ComponentFixture<GraphsBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphsBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
