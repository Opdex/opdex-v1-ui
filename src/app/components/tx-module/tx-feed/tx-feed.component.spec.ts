import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxFeedComponent } from './tx-feed.component';

describe('TxFeedComponent', () => {
  let component: TxFeedComponent;
  let fixture: ComponentFixture<TxFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxFeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
