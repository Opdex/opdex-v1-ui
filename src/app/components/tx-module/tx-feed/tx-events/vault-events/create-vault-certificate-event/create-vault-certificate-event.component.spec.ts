import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVaultCertificateEventComponent } from './create-vault-certificate-event.component';

describe('CreateVaultCertificateEventComponent', () => {
  let component: CreateVaultCertificateEventComponent;
  let fixture: ComponentFixture<CreateVaultCertificateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVaultCertificateEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVaultCertificateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
