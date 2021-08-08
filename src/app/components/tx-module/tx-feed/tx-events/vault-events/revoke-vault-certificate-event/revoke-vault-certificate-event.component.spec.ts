import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeVaultCertificateEventComponent } from './revoke-vault-certificate-event.component';

describe('RevokeVaultCertificateEventComponent', () => {
  let component: RevokeVaultCertificateEventComponent;
  let fixture: ComponentFixture<RevokeVaultCertificateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevokeVaultCertificateEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevokeVaultCertificateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
