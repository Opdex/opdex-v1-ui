import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemVaultCertificateEventComponent } from './redeem-vault-certificate-event.component';

describe('RedeemVaultCertificateEventComponent', () => {
  let component: RedeemVaultCertificateEventComponent;
  let fixture: ComponentFixture<RedeemVaultCertificateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedeemVaultCertificateEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemVaultCertificateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
