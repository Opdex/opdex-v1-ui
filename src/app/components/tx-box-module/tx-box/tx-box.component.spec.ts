import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxBoxComponent } from './tx-box.component';

describe('TxBoxComponent', () => {
  let component: TxBoxComponent;
  let fixture: ComponentFixture<TxBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
