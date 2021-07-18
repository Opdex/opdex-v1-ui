import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemVaulCertificateEventComponent } from './redeem-vaul-certificate-event.component';

describe('RedeemVaulCertificateEventComponent', () => {
  let component: RedeemVaulCertificateEventComponent;
  let fixture: ComponentFixture<RedeemVaulCertificateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedeemVaulCertificateEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemVaulCertificateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
