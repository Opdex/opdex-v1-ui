// Angular Core Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// CDK Imports
import { ClipboardModule } from '@angular/cdk/clipboard';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

// Opdex Component Imports
import { ChangeIndicatorComponent } from './change-indicator/change-indicator.component';
import { CopyButtonComponent } from './copy-button/copy-button.component';

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
    MatButtonModule,
    ClipboardModule
  ],
  exports: [
    ChangeIndicatorComponent,
    CopyButtonComponent
  ]
})
export class SharedModule { }
