import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxMineStopComponent } from './tx-mine-stop.component';

describe('TxMineStopComponent', () => {
  let component: TxMineStopComponent;
  let fixture: ComponentFixture<TxMineStopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxMineStopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxMineStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
