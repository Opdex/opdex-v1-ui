import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ChangeIndicatorComponent } from './change-indicator/change-indicator.component';
import { CopyButtonComponent } from './copy-button/copy-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ChangeIndicatorComponent,
    CopyButtonComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    ClipboardModule,
    MatButtonModule
  ],
  exports: [
    ChangeIndicatorComponent,
    CopyButtonComponent
  ]
})
export class SharedModule { }
