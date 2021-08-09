import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxProvideComponent } from './tx-provide.component';

describe('TxProvideComponent', () => {
  let component: TxProvideComponent;
  let fixture: ComponentFixture<TxProvideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxProvideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxProvideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
