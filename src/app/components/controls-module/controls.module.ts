// Angular Core Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatSliderModule } from '@angular/material/slider';

// Opdex Component Imports
import { DeadlineSliderComponent } from './deadline-slider/deadline-slider.component';

@NgModule({
  declarations: [
    DeadlineSliderComponent
  ],
  imports: [
    CommonModule,
    MatSliderModule
  ],
  exports: [
    DeadlineSliderComponent
  ]
})
export class ControlsModule { }
