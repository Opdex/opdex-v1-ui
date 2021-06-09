import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CardComponent } from './card/card.component';
import { MiningCardComponent } from './mining-card/mining-card.component';

@NgModule({
  declarations: [
    CardComponent,
    MiningCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    CardComponent,
    MiningCardComponent
  ]
})
export class CardsModule { }
