import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PairsTableComponent } from './pairs-table.component';

describe('PairsTableComponent', () => {
  let component: PairsTableComponent;
  let fixture: ComponentFixture<PairsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PairsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PairsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
