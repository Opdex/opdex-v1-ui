import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyAddressComponent } from './copy-address.component';

describe('CopyAddressComponent', () => {
  let component: CopyAddressComponent;
  let fixture: ComponentFixture<CopyAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
