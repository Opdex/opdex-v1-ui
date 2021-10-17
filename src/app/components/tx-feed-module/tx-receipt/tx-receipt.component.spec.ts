import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxReceiptComponent } from './tx-receipt.component';

describe('TxReceiptComponent', () => {
  let component: TxReceiptComponent;
  let fixture: ComponentFixture<TxReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
