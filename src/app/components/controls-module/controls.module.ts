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
import { AmountComponent } from './amount/amount.component';
import {ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DeadlineSliderComponent,
    AmountComponent
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
    AmountComponent
  ]
})
export class ControlsModule { }
