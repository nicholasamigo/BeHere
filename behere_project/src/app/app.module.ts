import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HelloWorldService } from './hello-world.service';

import { AppComponent } from './app.component';

import { GmapModule } from './gmap/gmap.module';


import { SocialLoginModule } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login/public-api';
//import { Ro }



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GmapModule,
    SocialLoginModule
  ],
  // https://medium.com/@danilrabizo/google-authentication-in-the-angular-application-e86df69be58a
  providers: [HelloWorldService, 
  {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: true,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('392022857244-ds33po9lfqcqo83mvsovppol0d0001op.apps.googleusercontent.com')
        }
      ]
    }
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
