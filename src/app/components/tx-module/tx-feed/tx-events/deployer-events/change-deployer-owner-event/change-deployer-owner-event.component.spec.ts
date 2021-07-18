import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDeployerOwnerEventComponent } from './change-deployer-owner-event.component';

describe('ChangeDeployerOwnerEventComponent', () => {
  let component: ChangeDeployerOwnerEventComponent;
  let fixture: ComponentFixture<ChangeDeployerOwnerEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDeployerOwnerEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDeployerOwnerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
