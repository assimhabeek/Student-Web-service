import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliberationsFormComponent } from './deliberations-form.component';

describe('DeliberationsFormComponent', () => {
  let component: DeliberationsFormComponent;
  let fixture: ComponentFixture<DeliberationsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliberationsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliberationsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
