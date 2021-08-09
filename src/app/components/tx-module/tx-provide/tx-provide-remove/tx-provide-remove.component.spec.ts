import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxProvideRemoveComponent } from './tx-provide-remove.component';

describe('TxProvideRemoveComponent', () => {
  let component: TxProvideRemoveComponent;
  let fixture: ComponentFixture<TxProvideRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxProvideRemoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxProvideRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
