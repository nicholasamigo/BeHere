import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HelloWorldService } from './hello-world.service';

import { AppComponent } from './app.component';

import { DataServiceService } from './data-service.service';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AppFirebaseModule } from './app-firebase.module';
import { AppMaterialModule } from './app-material.module';
import { CreateComponent } from './components/create/create.component';
import { FeedComponent } from './components/feed/feed.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { HeaderComponent } from './components/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { CardAComponent } from './components/card-a/card-a.component';
import { CardBComponent } from './components/card-b/card-b.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { EventsMiddlemanService } from './services/events-middleman.service';
import { MapAndFeedComponent } from './map-and-feed/map-and-feed.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateComponent,
    FeedComponent,
    ProfileCardComponent,
    HeaderComponent,
    CardAComponent,
    CardBComponent,
    MapAndFeedComponent
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppFirebaseModule,
    AppMaterialModule,
    AppRoutingModule,
    GoogleMapsModule,
    

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
  ],

  providers: [
   ScreenTrackingService, 
   UserTrackingService,
    HelloWorldService,
    DataServiceService, 
    EventsMiddlemanService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
