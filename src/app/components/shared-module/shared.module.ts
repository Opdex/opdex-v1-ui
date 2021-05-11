import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ChangeIndicatorComponent } from './change-indicator/change-indicator.component';


@NgModule({
  declarations: [
    ChangeIndicatorComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  exports: [
    ChangeIndicatorComponent
  ]
})
export class SharedModule { }
