import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { BrMaskerModule } from 'br-mask';
import { CalculadoraPageModule } from './calculadora/calculadora.module';
import {File} from '@ionic-native/file/ngx'
import {SocialSharing} from '@ionic-native/social-sharing/ngx'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, CalculadoraPageModule],
  providers: [
    StatusBar,
    SplashScreen,
    AdMobFree,
    BrMaskerModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    SocialSharing
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
