// Angular Core Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Opdex Component Imports
import { DeadlineComponent } from './deadline/deadline.component';
import { InputControlComponent } from './input-control/input-control.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToleranceComponent } from './tolerance/tolerance.component';

@NgModule({
  declarations: [
    DeadlineComponent,
    InputControlComponent,
    ToleranceComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    DeadlineComponent,
    InputControlComponent,
    ToleranceComponent
  ]
})
export class ControlsModule { }
