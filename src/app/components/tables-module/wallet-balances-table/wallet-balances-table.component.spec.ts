import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletBalancesTableComponent } from './wallet-balances-table.component';

describe('WalletBalancesTableComponent', () => {
  let component: WalletBalancesTableComponent;
  let fixture: ComponentFixture<WalletBalancesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletBalancesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletBalancesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
