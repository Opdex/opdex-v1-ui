import { SharedModule } from './../shared-module/shared.module';
import { SharedPipesModule } from './../../pipes/shared-pipes.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CardComponent } from './card/card.component';
import { MiningCardComponent } from './mining-card/mining-card.component';
import { LiquidityPoolCardComponent } from './liquidity-pool-card/liquidity-pool-card.component';
import { StakingPoolCardComponent } from './staking-pool-card/staking-pool-card.component';
import { StatCardComponent } from './stat-card/stat-card.component';

@NgModule({
  declarations: [
    CardComponent,
    MiningCardComponent,
    LiquidityPoolCardComponent,
    StakingPoolCardComponent,
    StatCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    SharedPipesModule,
    SharedModule
  ],
  exports: [
    CardComponent,
    MiningCardComponent,
    LiquidityPoolCardComponent,
    StakingPoolCardComponent,
    StatCardComponent
  ]
})
export class CardsModule { }
