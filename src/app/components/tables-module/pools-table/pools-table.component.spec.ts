import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolsTableComponent } from './pools-table.component';

describe('PoolsTableComponent', () => {
  let component: PoolsTableComponent;
  let fixture: ComponentFixture<PoolsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
