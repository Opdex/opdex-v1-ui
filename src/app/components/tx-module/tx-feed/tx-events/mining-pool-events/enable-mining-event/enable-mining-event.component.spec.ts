import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableMiningEventComponent } from './enable-mining-event.component';

describe('EnableMiningEventComponent', () => {
  let component: EnableMiningEventComponent;
  let fixture: ComponentFixture<EnableMiningEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnableMiningEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableMiningEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
