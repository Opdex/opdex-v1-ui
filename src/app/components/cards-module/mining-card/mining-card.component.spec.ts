import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningCardComponent } from './mining-card.component';

describe('MiningCardComponent', () => {
  let component: MiningCardComponent;
  let fixture: ComponentFixture<MiningCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiningCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiningCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
