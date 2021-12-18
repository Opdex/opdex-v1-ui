import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxVaultProposalVoteComponent } from './tx-vault-proposal-vote.component';

describe('TxVaultProposalVoteComponent', () => {
  let component: TxVaultProposalVoteComponent;
  let fixture: ComponentFixture<TxVaultProposalVoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxVaultProposalVoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxVaultProposalVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
