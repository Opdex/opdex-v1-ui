import { TxFeedModule } from './components/tx-feed-module/tx-feed.module';
import { ControlsModule } from '@sharedComponents/controls-module/controls.module';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtService } from './services/utility/jwt.service';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationModule } from './components/navigation-module/navigation.module';
import { TransactionModule } from './components/tx-module/tx.module';
import { ChartsModule } from './components/charts-module/charts.module';
import { TablesModule } from '@sharedComponents/tables-module/tables.module';
import { ModalsModule } from '@sharedComponents/modals-module/modals.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { CardsModule } from '@sharedComponents/cards-module/cards.module';
import { SharedModule } from '@sharedComponents/shared-module/shared.module';
import { MatBottomSheetModule, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material/bottom-sheet';

import { PoolsComponent } from './views/pools/pools.component';
import { PoolComponent } from './views/pool/pool.component';
import { MarketComponent } from './views/market/market.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { TokensComponent } from './views/tokens/tokens.component';
import { TokenComponent } from './views/token/token.component';
import { AuthComponent } from './views/auth/auth.component';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WalletComponent } from './views/wallet/wallet.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MiningGovernanceComponent } from './views/mining-governance/mining-governance.component';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { jwtOptionsFactory } from '@sharedServices/utility/jwt.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorMiddlewareService } from '@sharedServices/middleware/error-middleware.service';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
import { environment } from '@environments/environment';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationsModule } from '@sharedComponents/notifications-module/notifications.module';
import { TradeComponent } from './views/trade/trade.component';
import { VaultComponent } from './views/vault/vault.component';
import { VaultProposalComponent } from './views/vault-proposal/vault-proposal.component';
import { checkForUpdates } from '@sharedServices/check-for-updates';

@NgModule({
  declarations: [
    AppComponent,
    PoolsComponent,
    PoolComponent,
    MarketComponent,
    NotFoundComponent,
    TokensComponent,
    TokenComponent,
    WalletComponent,
    MiningGovernanceComponent,
    AuthComponent,
    TradeComponent,
    VaultComponent,
    VaultProposalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NavigationModule,
    TransactionModule,
    ChartsModule,
    TablesModule,
    ModalsModule,
    SharedPipesModule,
    NotificationsModule,
    CardsModule,
    SharedModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatBottomSheetModule,
    MatTabsModule,
    ClipboardModule,
    MatChipsModule,
    MatMenuModule,
    LayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
    ControlsModule,
    MatSnackBarModule,
    TxFeedModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [JwtService]
      }
    }),
    NgxGoogleAnalyticsModule.forRoot(environment.ga),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    })
  ],
  providers: [
    JwtService,
    {
      provide: APP_INITIALIZER,
      useFactory: checkForUpdates,
      multi: true,
      deps: [SwUpdate]
    },
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true
      }
    },
    {
      provide: ErrorHandler,
      useClass: ErrorMiddlewareService,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
