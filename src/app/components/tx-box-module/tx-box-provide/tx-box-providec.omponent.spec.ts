import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxBoxProvideComponent } from './tx-box-provide.component';

describe('TxBoxProvideComponent', () => {
  let component: TxBoxProvideComponent;
  let fixture: ComponentFixture<TxBoxProvideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxBoxProvideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxBoxProvideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
