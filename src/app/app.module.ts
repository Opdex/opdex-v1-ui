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

import { PairsComponent } from './views/pairs/pairs.component';
import { PairComponent } from './views/pair/pair.component';
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

@NgModule({
  declarations: [
    AppComponent,
    PairsComponent,
    PairComponent,
    OverviewComponent,
    NotFoundComponent,
    TokensComponent,
    TokenComponent
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
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
