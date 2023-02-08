import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GmapComponent } from './gmap.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    GmapComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
  ],
  exports: [
    GmapComponent
  ]
})
export class GmapModule { }
