import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HelloWorldService } from './hello-world.service';

import { AppComponent } from './app.component';

import { GmapModule } from './gmap/gmap.module';
import { EventService } from './event.service';
import { DataServiceService } from './data-service.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GmapModule,
  ],
  providers: [
    HelloWorldService,
    EventService,
    DataServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
