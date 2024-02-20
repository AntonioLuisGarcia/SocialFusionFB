import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from './core/translate/translate';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from './core/services/api.service';
import { AuthStrapiService } from './core/services/api/strapi/auth-strapi.service';
import { JwtService } from './core/services/jwt.service';
import { HttpClientWebProvider } from './core/services/http-client-web.provider';
import { AuthService } from './core/services/auth.service';
import { HttpClientProvider } from './core/services/http-client.provider';
import { MediaStrapiService } from './core/services/api/strapi/media-strapi.service';
import { MediaService } from './core/services/media.service';
import { SharedModule } from "./shared/shared.module";
import { HoverColorDirective } from './shared/directives/hover-color.directive';
import { FirebaseService } from './core/services/firebase/firebase.service';
import { AuthFirebaseService } from './core/services/api/firebase/auth-firebase.service';
import { environment } from 'src/environments/environment';
import { MediaFirebaseService } from './core/services/api/firebase/media-firebase.service';

export function httpProviderFactory(
  http:HttpClient,
  platform:Platform) {
  return new HttpClientWebProvider(http);
}

export function AuthServiceFactory(
  backend:string,
  jwt:JwtService,
  api:ApiService,
  firebase:FirebaseService
) {
    switch(backend){
      case 'Strapi':
        return new AuthStrapiService(jwt, api);
      case 'Firebase':
        return new AuthFirebaseService(firebase);
      default:
        console.log(backend);
        throw new Error("Not implemented");
    }
}

export function MediaServiceFactory(
  backend:string,
  api:ApiService,
  firebase:FirebaseService){
    switch(backend){
      case 'Strapi':
        return new MediaStrapiService(api);
      case 'Firebase':
        return new MediaFirebaseService(firebase)
      default:
        throw new Error("Not implemented");
    }
}

@NgModule({
    declarations: [
        AppComponent,
        HoverColorDirective,
    ],
    providers: [
        {
          provide: 'firebase-config',
          useValue:environment.firebase
        },
        {
            provide: 'backend',
            useValue: 'Firebase'
        },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        {
            provide: HttpClientProvider,
            deps: [HttpClient, Platform],
            useFactory: httpProviderFactory,
        },
        {
            provide: AuthService,
            deps: ['backend', JwtService, ApiService, FirebaseService],
            useFactory: AuthServiceFactory,
        }, {
            provide: MediaService,
            deps: ['backend', ApiService, FirebaseService],
            useFactory: MediaServiceFactory,
        }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        SharedModule
    ]
})
export class AppModule {}