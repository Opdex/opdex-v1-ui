import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopStakingEventComponent } from './stop-staking-event.component';

describe('StopStakingEventComponent', () => {
  let component: StopStakingEventComponent;
  let fixture: ComponentFixture<StopStakingEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopStakingEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StopStakingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
