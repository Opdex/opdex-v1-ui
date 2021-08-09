import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalEventComponent } from './approval-event.component';

describe('ApprovalEventComponent', () => {
  let component: ApprovalEventComponent;
  let fixture: ComponentFixture<ApprovalEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
