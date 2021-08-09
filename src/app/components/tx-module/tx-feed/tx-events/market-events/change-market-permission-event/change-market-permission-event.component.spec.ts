import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMarketPermissionEventComponent } from './change-market-permission-event.component';

describe('ChangeMarketPermissionEventComponent', () => {
  let component: ChangeMarketPermissionEventComponent;
  let fixture: ComponentFixture<ChangeMarketPermissionEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeMarketPermissionEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMarketPermissionEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
