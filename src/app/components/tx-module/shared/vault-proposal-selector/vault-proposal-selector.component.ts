import { IndexService } from '@sharedServices/platform/index.service';
import { VaultProposal } from '@sharedModels/ui/vaults/vault-proposal';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, take } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { VaultsService } from '@sharedServices/platform/vaults.service';
import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';

@Component({
  selector: 'opdex-vault-proposal-selector',
  templateUrl: './vault-proposal-selector.component.html',
  styleUrls: ['./vault-proposal-selector.component.scss']
})
export class VaultProposalSelectorComponent implements OnChanges {
  @Input() data: any;
  @Output() onProposalChange = new EventEmitter<VaultProposal>();

  form: FormGroup;
  proposal: VaultProposal;
  latestBlock: IBlock;
  proposalFound: boolean = true;
  icons = Icons;
  iconSizes = IconSizes;
  subscription = new Subscription();

  get proposalId(): FormControl {
    return this.form.get('proposalId') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _vaultsService: VaultsService,
    private _indexService: IndexService
  ) {
    this.form = this._fb.group({
      proposalId: ['', [Validators.required, Validators.min(1)]],
    });

    this.subscription.add(
      this._indexService.latestBlock$
        .subscribe(block => this.latestBlock = block));

    this.subscription.add(
      this.proposalId.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          filter(value => !!value),
          switchMap(proposalId => this._vaultsService.getProposal(proposalId).pipe(catchError(_ => of(undefined)))))
        .subscribe(proposal => {
          this.proposal = proposal;
          this.onProposalChange.emit(proposal);
          this.proposalFound = !!proposal;
        }));
  }

  ngOnChanges(): void {
    if (!!this.data) {
      // -- data.proposalId
      // -- data.proposal

      if (this.data.proposalId) {
        this._vaultsService.getProposal(this.data.proposalId)
          .pipe(take(1))
          .subscribe(proposal => {
            this.proposal = proposal;
            this.onProposalChange.emit(proposal)
          });
      }
    }
  }

  handleClose(): void {
    this.proposal = null;
    this.onProposalChange.emit(this.proposal);
    this.proposalId.setValue(null);
  }
}
