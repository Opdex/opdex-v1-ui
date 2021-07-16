import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SideNavComponent } from './side-nav/side-nav.component';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';

@NgModule({
  declarations: [
    SideNavComponent,
    MobileNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule
  ],
  exports: [
    SideNavComponent,
    MobileNavComponent
  ]
})
export class NavigationModule { }
