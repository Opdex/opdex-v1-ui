import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimPendingMarketOwnerEventComponent } from './claim-pending-market-owner-event.component';

describe('ClaimPendingMarketOwnerEventComponent', () => {
  let component: ClaimPendingMarketOwnerEventComponent;
  let fixture: ComponentFixture<ClaimPendingMarketOwnerEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimPendingMarketOwnerEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimPendingMarketOwnerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
