import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimPendingVaultOwnerEventComponent } from './claim-pending-vault-owner-event.component';

describe('ClaimPendingVaultOwnerEventComponent', () => {
  let component: ClaimPendingVaultOwnerEventComponent;
  let fixture: ComponentFixture<ClaimPendingVaultOwnerEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimPendingVaultOwnerEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimPendingVaultOwnerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
