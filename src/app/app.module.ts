import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarModule } from './components/sidebar-module/sidebar.module';
import { TxBoxModule } from './components/tx-box-module/tx-box.module';
import { ChartsModule } from './components/charts-module/charts.module';
import { TablesModule } from '@sharedComponents/tables-module/tables.module';
import { ModalsModule } from '@sharedComponents/modals-module/modals.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { CardsModule } from '@sharedComponents/cards-module/cards.module';
import { SharedModule } from '@sharedComponents/shared-module/shared.module';


import { PoolsComponent } from './views/pools/pools.component';
import { PoolComponent } from './views/pool/pool.component';
import { OverviewComponent } from './views/overview/overview.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { TokensComponent } from './views/tokens/tokens.component';
import { TokenComponent } from './views/token/token.component';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { HoldingsComponent } from './views/holdings/holdings.component';
import { HistoryComponent } from './views/history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    PoolsComponent,
    PoolComponent,
    OverviewComponent,
    NotFoundComponent,
    TokensComponent,
    TokenComponent,
    HoldingsComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SidebarModule,
    TxBoxModule,
    ChartsModule,
    TablesModule,
    ModalsModule,
    SharedPipesModule,
    CardsModule,
    SharedModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
