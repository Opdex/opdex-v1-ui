import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContext } from '@sharedModels/user-context';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { IndexService } from '@sharedServices/platform/index.service';
import { Icons } from 'src/app/enums/icons';
import { VaultCertificate } from '@sharedModels/ui/vaults/vault-certificate';
import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReviewQuoteComponent } from '@sharedComponents/tx-module/shared/review-quote/review-quote.component';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { take } from 'rxjs/operators';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';

@Component({
  selector: 'opdex-vault-certificate-card',
  templateUrl: './vault-certificate-card.component.html',
  styleUrls: ['./vault-certificate-card.component.scss']
})
export class VaultCertificateCardComponent implements OnDestroy {
  @Input() cert: VaultCertificate;
  context: UserContext;
  latestBlock: number;
  icons = Icons;
  subscription = new Subscription();

  public get vested(): boolean {
    return !!this.latestBlock && !! this.cert && this.latestBlock > this.cert.vestingEndBlock;
  }

  public get showMenu(): boolean {
    return this.showRedemption || this.showRevocation;
  }

  public get showRedemption(): boolean {
    return this.context?.wallet === this.cert.owner && !this.cert.redeemed && this.vested;
  }

  public get showRevocation(): boolean {
    return this.context?.wallet && !this.vested && !this.cert.revoked
  }

  constructor(
    private _indexService: IndexService,
    private _userContextService: UserContextService,
    private _platformApiService: PlatformApiService,
    private _env: EnvironmentsService,
    private _bottomSheet: MatBottomSheet,
    private _sidebar: SidenavService
  ) {
    this.subscription.add(
      this._indexService.latestBlock$
        .subscribe(block => this.latestBlock = block.height));

    this.subscription.add(
      this._userContextService.getUserContext$()
        .subscribe(context => this.context = context));
  }

  revokeProposal(): void {
    if (!this.context?.wallet || !this.cert) return;

    const data = {
      childView: 'Revoke',
      form: {
        type: 2,
        recipient: this.cert.owner
      }
    }

    this._sidebar.openSidenav(TransactionView.vaultProposal, data);
  }

  quoteRedemption(): void {
    if (!this.context?.wallet) return;

    this._platformApiService
      .redeemVaultCertificate(this._env.vaultAddress)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this._bottomSheet.open(ReviewQuoteComponent, { data: quote }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
