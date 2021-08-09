import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxAllowanceComponent } from './tx-allowance.component';

describe('TxAllowanceComponent', () => {
  let component: TxAllowanceComponent;
  let fixture: ComponentFixture<TxAllowanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxAllowanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
