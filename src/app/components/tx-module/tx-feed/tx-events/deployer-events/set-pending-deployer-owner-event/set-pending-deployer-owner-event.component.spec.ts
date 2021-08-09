import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPendingDeployerOwnerEventComponent } from './set-pending-deployer-owner-event.component';

describe('SetPendingDeployerOwnerEventComponent', () => {
  let component: SetPendingDeployerOwnerEventComponent;
  let fixture: ComponentFixture<SetPendingDeployerOwnerEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetPendingDeployerOwnerEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPendingDeployerOwnerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
