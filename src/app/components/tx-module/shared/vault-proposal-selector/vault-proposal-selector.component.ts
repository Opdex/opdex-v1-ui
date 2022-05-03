import { IndexService } from '@sharedServices/platform/index.service';
import { VaultProposal } from '@sharedModels/ui/vaults/vault-proposal';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
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
          switchMap(proposalId => this._vaultsService.getProposal(proposalId)))
          // Catch Error
        .subscribe(proposal => {
          this.proposal = proposal;
          this.onProposalChange.emit(proposal);
        }));
  }

  ngOnChanges(): void {
    if (!!this.data) {
      // -- data.proposalId
      // -- data.proposal
    }
  }
}
