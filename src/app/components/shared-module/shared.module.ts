import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ChangeIndicatorComponent } from './change-indicator/change-indicator.component';
import { HelpIconComponent } from './help-icon/help-icon.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ChangeIndicatorComponent,
    HelpIconComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule, 
    MatButtonModule
  ],
  exports: [
    ChangeIndicatorComponent,
    HelpIconComponent
  ]
})
export class SharedModule { }
