import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ChangeIndicatorComponent } from './change-indicator/change-indicator.component';
import { HelpButtonComponent } from './help-button/help-button.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ChangeIndicatorComponent,
    HelpButtonComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule, 
    MatButtonModule
  ],
  exports: [
    ChangeIndicatorComponent,
    HelpButtonComponent
  ]
})
export class SharedModule { }
