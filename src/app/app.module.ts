import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarModule } from './components/sidebar-module/sidebar.module';
import { SwapModule } from './components/swap-module/swap.module';
import { ChartsModule } from './components/charts-module/charts.module';

import { PairsComponent } from './views/pairs/pairs.component';
import { PairComponent } from './views/pair/pair.component';
import { OverviewComponent } from './views/overview/overview.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { PairsTableComponent } from './components/pairs-table/pairs-table.component';
import { TokensTableComponent } from './components/tokens-table/tokens-table.component';
import { TokensComponent } from './views/tokens/tokens.component';
import { TokenComponent } from './views/token/token.component';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    PairsComponent,
    PairComponent,
    OverviewComponent,
    NotFoundComponent,
    PairsTableComponent,
    TokensTableComponent,
    TokensComponent,
    TokenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SidebarModule,
    SwapModule,
    ChartsModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
