import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMarketOwnerEventComponent } from './change-market-owner-event.component';

describe('ChangeMarketOwnerEventComponent', () => {
  let component: ChangeMarketOwnerEventComponent;
  let fixture: ComponentFixture<ChangeMarketOwnerEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeMarketOwnerEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMarketOwnerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
