import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletMiningPositionsTableComponent } from './wallet-mining-positions-table.component';

describe('WalletMiningPositionsTableComponent', () => {
  let component: WalletMiningPositionsTableComponent;
  let fixture: ComponentFixture<WalletMiningPositionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletMiningPositionsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletMiningPositionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
