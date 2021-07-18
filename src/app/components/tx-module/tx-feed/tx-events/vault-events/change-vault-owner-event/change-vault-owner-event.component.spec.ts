import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeVaultOwnerEventComponent } from './change-vault-owner-event.component';

describe('ChangeVaultOwnerEventComponent', () => {
  let component: ChangeVaultOwnerEventComponent;
  let fixture: ComponentFixture<ChangeVaultOwnerEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeVaultOwnerEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeVaultOwnerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
