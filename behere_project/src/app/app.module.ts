import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HelloWorldService } from './hello-world.service';

import { AppComponent } from './app.component';

import { GmapModule } from './gmap/gmap.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GmapModule,
  ],
  providers: [HelloWorldService],
  bootstrap: [AppComponent]
})
export class AppModule { }
