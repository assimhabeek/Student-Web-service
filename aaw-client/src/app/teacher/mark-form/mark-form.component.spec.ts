import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkFormComponent } from './mark-form.component';

describe('MarkFormComponent', () => {
  let component: MarkFormComponent;
  let fixture: ComponentFixture<MarkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
