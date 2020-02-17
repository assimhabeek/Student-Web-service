import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliberationComponent } from './deliberation.component';

describe('DeliberationComponent', () => {
  let component: DeliberationComponent;
  let fixture: ComponentFixture<DeliberationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliberationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliberationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
