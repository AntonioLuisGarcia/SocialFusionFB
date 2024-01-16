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
import { AuthStrapiService } from './core/services/strapi/auth-strapi.service';
import { JwtService } from './core/services/jwt.service';
import { HttpClientWebProvider } from './core/services/http-client-web.provider';
import { AuthService } from './core/services/auth.service';
import { HttpClientProvider } from './core/services/http-client.provider';
import { MediaStrapiService } from './core/services/strapi/media-strapi.service';
import { MediaService } from './core/services/media.service';
import { SharedModule } from "./shared/shared.module";
import { HoverColorDirective } from './shared/directives/hover-color.directive';

export function httpProviderFactory(
  http:HttpClient,
  platform:Platform) {
  return new HttpClientWebProvider(http);
}

export function AuthServiceFactory(
  jwt:JwtService,
  api:ApiService
) {
  return new AuthStrapiService(jwt, api);
}

export function MediaServiceFactory(
  backend:string,
  api:ApiService){
    switch(backend){
      case 'Strapi':
        return new MediaStrapiService(api);
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
            provide: 'backend',
            useValue: 'Strapi'
        },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        {
            provide: HttpClientProvider,
            deps: [HttpClient, Platform],
            useFactory: httpProviderFactory,
        },
        {
            provide: AuthService,
            deps: [JwtService, ApiService],
            useFactory: AuthServiceFactory,
        }, {
            provide: MediaService,
            deps: ['backend', ApiService],
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