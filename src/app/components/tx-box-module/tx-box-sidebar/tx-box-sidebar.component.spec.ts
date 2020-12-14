import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxBoxSidebarComponent } from './tx-box-sidebar.component';

describe('TxBoxSidebarComponent', () => {
  let component: TxBoxSidebarComponent;
  let fixture: ComponentFixture<TxBoxSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxBoxSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxBoxSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
