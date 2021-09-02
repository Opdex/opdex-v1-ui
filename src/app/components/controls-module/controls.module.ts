// Angular Core Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Opdex Component Imports
import { DeadlineSliderComponent } from './deadline-slider/deadline-slider.component';
import { InputControlComponent } from './input-control/input-control.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DeadlineSliderComponent,
    InputControlComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    DeadlineSliderComponent,
    InputControlComponent
  ]
})
export class ControlsModule { }
