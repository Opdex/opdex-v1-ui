import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultCertificatesTableComponent } from './vault-certificates-table.component';

describe('VaultCertificatesTableComponent', () => {
  let component: VaultCertificatesTableComponent;
  let fixture: ComponentFixture<VaultCertificatesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaultCertificatesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultCertificatesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
