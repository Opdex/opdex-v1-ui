import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeVaulCertificateEventComponent } from './revoke-vaul-certificate-event.component';

describe('RevokeVaulCertificateEventComponent', () => {
  let component: RevokeVaulCertificateEventComponent;
  let fixture: ComponentFixture<RevokeVaulCertificateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevokeVaulCertificateEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevokeVaulCertificateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
