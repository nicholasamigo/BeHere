import {
    AngularFireAuthGuard,
    redirectUnauthorizedTo,
  } from '@angular/fire/compat/auth-guard';
  import { NgModule } from '@angular/core';
  import { Routes, RouterModule } from '@angular/router';
  
  import { BASE, CREATE, FEED } from './consts/routes.const';
  import { CreateComponent } from './components/create/create.component';
  import { FeedComponent } from './components/feed/feed.component';
import { MapAndFeedComponent } from './map-and-feed/map-and-feed.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
  
  const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([FEED]);
  
  const routes: Routes = [
    {
      path: BASE,
      redirectTo: `/${FEED}`,
      pathMatch: 'full',
    },
    {
      path: FEED,
      component: MapAndFeedComponent,
    },
    {
      path: CREATE,
      component: MyEventsComponent,
      canActivate: [AngularFireAuthGuard],
      data: { authGuardPipe: redirectUnauthorizedToLogin },
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}
  