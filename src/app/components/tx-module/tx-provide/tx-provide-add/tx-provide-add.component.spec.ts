import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxProvideAddComponent } from './tx-provide-add.component';

describe('TxProvideAddComponent', () => {
  let component: TxProvideAddComponent;
  let fixture: ComponentFixture<TxProvideAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxProvideAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxProvideAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
