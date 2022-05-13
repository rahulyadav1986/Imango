import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
// import {SocialLoginModule, SocialAuthServiceConfig, SocialAuthService} from 'angularx-social-login';
// import {GoogleLoginProvider} from 'angularx-social-login';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ReactiveFormsModule,
    FormsModule
   //  , IonicStorageModule.forRoot()
  ],
  providers: [
    AuthService,
    // SocialAuthService,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider(
    //           '712517938598-s874aa1o2fon9kp5kehoo5vig11kntdb.apps.googleusercontent.com'
    //         )
    //       },
    //     ],
    //   } as SocialAuthServiceConfig
    // }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
