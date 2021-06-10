import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxStakeStartComponent } from './tx-stake-start.component';

describe('TxStakeStartComponent', () => {
  let component: TxStakeStartComponent;
  let fixture: ComponentFixture<TxStakeStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxStakeStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxStakeStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
