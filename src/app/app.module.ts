import { JwtService } from './services/utility/jwt.service';
import { WalletService } from '@sharedServices/wallet.service';
import { ApiInterceptor } from './services/api/api-interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarModule } from './components/shared-module/sidebar-module/sidebar.module';
import { TransactionModule } from './components/tx-module/tx.module';
import { ChartsModule } from './components/charts-module/charts.module';
import { TablesModule } from '@sharedComponents/tables-module/tables.module';
import { ModalsModule } from '@sharedComponents/modals-module/modals.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { CardsModule } from '@sharedComponents/cards-module/cards.module';
import { SharedModule } from '@sharedComponents/shared-module/shared.module';


import { PoolsComponent } from './views/pools/pools.component';
import { PoolComponent } from './views/pool/pool.component';
import { MarketComponent } from './views/market/market.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { TokensComponent } from './views/tokens/tokens.component';
import { TokenComponent } from './views/token/token.component';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WalletComponent } from './views/wallet/wallet.component';
import { HistoryComponent } from './views/history/history.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { LayoutModule } from '@angular/cdk/layout';
import { GovernanceComponent } from './views/governance/governance.component';
import { VaultComponent } from './views/vault/vault.component';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { jwtOptionsFactory } from '@sharedServices/utility/jwt.service';

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
    HistoryComponent,
    GovernanceComponent,
    VaultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SidebarModule,
    TransactionModule,
    ChartsModule,
    TablesModule,
    ModalsModule,
    SharedPipesModule,
    CardsModule,
    SharedModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSidenavModule,
    MatChipsModule,
    MatMenuModule,
    LayoutModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [JwtService]
      }
    })
  ],
  providers: [
    JwtService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
      deps: [WalletService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
