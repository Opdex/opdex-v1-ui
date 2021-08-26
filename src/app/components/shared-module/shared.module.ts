import { SharedPipesModule } from './../../pipes/shared-pipes.module';
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
import { HelpButtonComponent } from './help-button/help-button.component';

@NgModule({
  declarations: [
    ChangeIndicatorComponent,
    CopyButtonComponent,
    HelpButtonComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    ClipboardModule,
    SharedPipesModule
  ],
  exports: [
    ChangeIndicatorComponent,
    CopyButtonComponent,
    MatIconModule,
    MatButtonModule,
    ChangeIndicatorComponent,
    HelpButtonComponent
  ]
})
export class SharedModule { }
