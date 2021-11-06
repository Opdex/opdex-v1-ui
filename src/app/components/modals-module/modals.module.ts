import { SharedModule } from '@sharedComponents/shared-module/shared.module';
import { SharedPipesModule } from '@sharedPipes/shared-pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

import { HelpModalComponent } from './help-modal/help-modal.component';
import { BugReportModalComponent } from './bug-report-modal/bug-report-modal.component';
import { AppUpdateModalComponent } from './app-update-modal/app-update-modal.component';

@NgModule({
  declarations: [
    HelpModalComponent,
    BugReportModalComponent,
    AppUpdateModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedPipesModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatDividerModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    SharedModule
  ],
  exports: [
    HelpModalComponent,
    BugReportModalComponent,
    AppUpdateModalComponent
  ]
})
export class ModalsModule { }
