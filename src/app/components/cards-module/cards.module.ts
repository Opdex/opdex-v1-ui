import { SharedPipesModule } from './../../pipes/shared-pipes.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CardComponent } from './card/card.component';
import { MiningCardComponent } from './mining-card/mining-card.component';
import { LiquidityPoolCardComponent } from './liquidity-pool-card/liquidity-pool-card.component';

@NgModule({
  declarations: [
    CardComponent,
    MiningCardComponent,
    LiquidityPoolCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    SharedPipesModule
  ],
  exports: [
    CardComponent,
    MiningCardComponent,
    LiquidityPoolCardComponent
  ]
})
export class CardsModule { }
