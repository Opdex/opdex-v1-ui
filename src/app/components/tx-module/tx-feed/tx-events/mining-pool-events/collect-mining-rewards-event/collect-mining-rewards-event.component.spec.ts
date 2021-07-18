import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectMiningRewardsEventComponent } from './collect-mining-rewards-event.component';

describe('CollectMiningRewardsEventComponent', () => {
  let component: CollectMiningRewardsEventComponent;
  let fixture: ComponentFixture<CollectMiningRewardsEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectMiningRewardsEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectMiningRewardsEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
