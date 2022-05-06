import { VaultProposal } from '@sharedModels/ui/vaults/vault-proposal';
import { MatDialog } from '@angular/material/dialog';
import { IIndexStatus } from '@sharedModels/platform-api/responses/index/index-status.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ReviewQuoteComponent } from '@sharedComponents/tx-module/shared/review-quote/review-quote.component';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MaintenanceNotificationModalComponent } from '@sharedComponents/modals-module/maintenance-notification-modal/maintenance-notification-modal.component';
import { UserContext } from '@sharedModels/user-context';

@Component({
  selector: 'opdex-vault-proposal-card',
  templateUrl: './vault-proposal-card.component.html',
  styleUrls: ['./vault-proposal-card.component.scss']
})
export class VaultProposalCardComponent implements OnDestroy {
  @Input() proposal: VaultProposal;
  @Input() latestBlock: IBlock;
  @Output() onClose = new EventEmitter<void>();

  icons = Icons;
  iconSizes = IconSizes;
  context: UserContext;
  indexStatus: IIndexStatus;
  subscription = new Subscription();

  constructor(
    private _platformApiService: PlatformApiService,
    private _bottomSheet: MatBottomSheet,
    private _userContextService: UserContextService,
    private _sidenav: SidenavService,
    private _indexService: IndexService,
    private _dialog: MatDialog
  ) {
    this.subscription.add(this._userContextService.context$.subscribe(context => this.context = context));
    this.subscription.add(this._indexService.status$.subscribe(status => this.indexStatus = status));
  }

  openSidenav(childView: string, inFavor?: boolean) {
    this._sidenav.openSidenav(TransactionView.vaultProposal, { child: childView, inFavor, proposalId: this.proposal.proposalId});
  }

  getExpirationPercentage() {
    if (this.proposal.status === 'Complete' || this.proposal.expiration <= this.latestBlock.height) return 100;

    const threeDays = 60 * 60 * 24 * 3 / 16;
    const oneWeek = 60 * 60 * 24 * 7 / 16;
    const duration = this.proposal.status === 'Pledge' ? oneWeek : threeDays;
    const startBlock = this.proposal.expiration - duration;
    const blocksPassed = this.latestBlock.height - startBlock;

    return Math.floor((blocksPassed / duration) * 100);
  }

  completeProposal(): void {
    if (!this.context?.wallet) return;

    if (!!this.indexStatus?.available === false) {
      this._dialog.open(MaintenanceNotificationModalComponent, {width: '500px', autoFocus: false})
        .afterClosed()
        .pipe(take(1))
        .subscribe(result => {
          if (result) this.completeExecute();
        });
    } else {
      this.completeExecute()
    }
  }

  private completeExecute(): void {
    this._platformApiService.completeVaultProposal(this.proposal.vault, this.proposal.proposalId)
      .pipe(take(1))
      .subscribe(quote => this._bottomSheet.open(ReviewQuoteComponent, { data: quote }))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  close(): void {
    this.onClose.emit();
  }
}
