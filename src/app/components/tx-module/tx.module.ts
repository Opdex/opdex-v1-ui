import { TxFeedModule } from '../tx-feed-module/tx-feed.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { SharedPipesModule } from '@sharedPipes/shared-pipes.module';
import { CardsModule } from '@sharedComponents/cards-module/cards.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TxSwapComponent } from './tx-swap/tx-swap.component';
import { TxProvideComponent } from './tx-provide/tx-provide.component';
import { TxMineComponent } from './tx-mine/tx-mine.component';
import { TxStakeComponent } from './tx-stake/tx-stake.component';
import { TxMineStartComponent } from './tx-mine/tx-mine-start/tx-mine-start.component';
import { TxMineStopComponent } from './tx-mine/tx-mine-stop/tx-mine-stop.component';
import { TxMineCollectComponent } from './tx-mine/tx-mine-collect/tx-mine-collect.component';
import { TxStakeCollectComponent } from './tx-stake/tx-stake-collect/tx-stake-collect.component';
import { TxStakeStartComponent } from './tx-stake/tx-stake-start/tx-stake-start.component';
import { TxStakeStopComponent } from './tx-stake/tx-stake-stop/tx-stake-stop.component';
import { TxProvideAddComponent } from './tx-provide/tx-provide-add/tx-provide-add.component';
import { TxProvideRemoveComponent } from './tx-provide/tx-provide-remove/tx-provide-remove.component';
import { TxAllowanceComponent } from './tx-allowance/tx-allowance.component';
import { LiquidityPoolSelectorComponent } from './shared/liquidity-pool-selector/liquidity-pool-selector.component';
import { AllowanceValidationComponent } from './shared/allowance-validation/allowance-validation.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SharedModule } from '@sharedComponents/shared-module/shared.module';
import { ControlsModule } from '@sharedComponents/controls-module/controls.module';
import { ReviewQuoteComponent } from './shared/review-quote/review-quote.component';
import { TxCreatePoolComponent } from './tx-create-pool/tx-create-pool.component';
import { TxSidebarComponent } from './tx-sidebar/tx-sidebar.component';
import { WalletPreviewComponent } from './shared/wallet-preview/wallet-preview.component';
import { TxButtonsComponent } from './shared/tx-buttons/tx-buttons.component';
import { PercentageAmountButtonsComponent } from './shared/percentage-amount-buttons/percentage-amount-buttons.component';
import { TxVaultProposalComponent } from './tx-vault-proposal/tx-vault-proposal.component';
import { TxVaultProposalCreateComponent } from './tx-vault-proposal/tx-vault-proposal-create/tx-vault-proposal-create.component';
import { TxVaultProposalVoteComponent } from './tx-vault-proposal/tx-vault-proposal-vote/tx-vault-proposal-vote.component';
import { TxVaultProposalPledgeComponent } from './tx-vault-proposal/tx-vault-proposal-pledge/tx-vault-proposal-pledge.component';
import { TxQuoteErrorsComponent } from './shared/tx-quote-errors/tx-quote-errors.component';
import { TxQuoteErrorComponent } from './shared/tx-quote-error/tx-quote-error.component';

@NgModule({
  declarations: [
    TxSwapComponent,
    TxProvideComponent,
    TxMineComponent,
    TxStakeComponent,
    TxMineStartComponent,
    TxMineStopComponent,
    TxMineCollectComponent,
    TxStakeCollectComponent,
    TxStakeStartComponent,
    TxStakeStopComponent,
    TxProvideAddComponent,
    TxProvideRemoveComponent,
    TxAllowanceComponent,
    LiquidityPoolSelectorComponent,
    AllowanceValidationComponent,
    ReviewQuoteComponent,
    TxCreatePoolComponent,
    TxSidebarComponent,
    WalletPreviewComponent,
    TxButtonsComponent,
    PercentageAmountButtonsComponent,
    TxVaultProposalComponent,
    TxVaultProposalCreateComponent,
    TxVaultProposalVoteComponent,
    TxVaultProposalPledgeComponent,
    TxQuoteErrorsComponent,
    TxQuoteErrorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    SharedPipesModule,
    ClipboardModule,
    SharedModule,
    ControlsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    TxFeedModule,
    MatSlideToggleModule
  ],
  exports: [
    TxSwapComponent,
    TxProvideComponent,
    TxMineComponent,
    TxStakeComponent,
    TxAllowanceComponent,
    TxCreatePoolComponent,
    TxSidebarComponent,
    TxButtonsComponent
  ]
})
export class TransactionModule { }
