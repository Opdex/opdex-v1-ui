import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletPositionCardComponent } from './wallet-position-card.component';

describe('WalletPositionCardComponent', () => {
  let component: WalletPositionCardComponent;
  let fixture: ComponentFixture<WalletPositionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletPositionCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPositionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
