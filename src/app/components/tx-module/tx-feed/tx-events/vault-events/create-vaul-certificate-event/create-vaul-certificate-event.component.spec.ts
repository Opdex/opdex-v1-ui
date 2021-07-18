import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVaulCertificateEventComponent } from './create-vaul-certificate-event.component';

describe('CreateVaulCertificateEventComponent', () => {
  let component: CreateVaulCertificateEventComponent;
  let fixture: ComponentFixture<CreateVaulCertificateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVaulCertificateEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVaulCertificateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
