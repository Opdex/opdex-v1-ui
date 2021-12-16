import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxVaultProposalComponent } from './tx-vault-proposal.component';

describe('TxVaultProposalComponent', () => {
  let component: TxVaultProposalComponent;
  let fixture: ComponentFixture<TxVaultProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxVaultProposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxVaultProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
