// Angular Core Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatSliderModule } from '@angular/material/slider';

// Opdex Component Imports
import { DateSliderComponent } from './date-slider/date-slider.component';

@NgModule({
  declarations: [
    DateSliderComponent
  ],
  imports: [
    CommonModule,
    MatSliderModule
  ],
  exports: [
    DateSliderComponent
  ]
})
export class ControlsModule { }
