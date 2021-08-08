import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLiquidityEventComponent } from './add-liquidity-event.component';

describe('AddLiquidityEventComponent', () => {
  let component: AddLiquidityEventComponent;
  let fixture: ComponentFixture<AddLiquidityEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLiquidityEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLiquidityEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
