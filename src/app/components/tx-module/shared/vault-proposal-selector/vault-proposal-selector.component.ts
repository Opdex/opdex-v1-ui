import { OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
import { IndexService } from '@sharedServices/platform/index.service';
import { VaultProposal } from '@sharedModels/ui/vaults/vault-proposal';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
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
export class VaultProposalSelectorComponent implements OnChanges, OnDestroy {
  @Input() data: any;
  @Output() onProposalChange = new EventEmitter<VaultProposal>();

  form: FormGroup;
  proposal: VaultProposal;
  latestBlock: IBlock;
  error: string;
  searching: boolean;
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
      proposalId: [undefined, [Validators.required, Validators.min(1)]],
    });

    this.subscription.add(
      this._indexService.latestBlock$
        .pipe(
          tap(block => this.latestBlock = block),
          switchMap(_ => this._getProposal$()))
        .subscribe());

    this.subscription.add(
      this.proposalId.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(proposalId => this._getProposal$(proposalId)))
        .subscribe());
  }

  ngOnChanges(): void {
    if (!!this.data) {
      const { proposal, proposalId } = this.data;
      let id = proposal?.id || proposalId;

      if (id) this.proposalId.setValue(id);
    }
  }

  private _getProposal$(id?: number): Observable<VaultProposal> {
    this.searching = true;
    const proposalId = id || this.proposal?.proposalId || this.proposalId.value;

    if (!proposalId) {
      this._setProposal(undefined);
      return of(undefined);
    };

    return this._vaultsService.getProposal(proposalId)
      .pipe(
        catchError(_ => {
          this.error = "Invalid proposal number";
          return of(undefined)
        }),
        tap(proposal => {
          if (!!proposal) this.error = undefined;
          this._setProposal(proposal);
        }));
  }

  private _setProposal(proposal: VaultProposal) {
    this.proposal = proposal;
    this.onProposalChange.emit(this.proposal);
    this.searching = false;
  }

  handleClose(): void {
    this._setProposal(undefined);
    this.proposalId.setValue(undefined);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
