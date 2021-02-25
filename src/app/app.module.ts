import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// Calendar UI Module
import { CalendarModule } from 'ion2-calendar';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { NgOtpInputModule } from 'ng-otp-input';
import { EmbedVideo } from 'ngx-embed-video';
import { Base64 } from '@ionic-native/base64/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { BackgroundFetch, BackgroundFetchConfig } from '@ionic-native/background-fetch/ngx';

import { NgNumericKeyboardModule } from 'ng-numeric-keyboard';
import { FilePath } from '@ionic-native/file-path/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FacebookModule } from 'ngx-facebook';

import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { Downloader } from '@ionic-native/downloader/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AngularAgoraRtcModule, AgoraConfig } from 'angular-agora-rtc';


import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// const chat_config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

const config = {
  apiKey: "AIzaSyAXMdfk33fyZ02OCvbFhm_JOiySaXvCShY",
  authDomain: "amandeephospitalchat.firebaseapp.com",
  databaseURL: "https://amandeephospitalchat.firebaseio.com",
  projectId: "amandeephospitalchat",
  storageBucket: "amandeephospitalchat.appspot.com",
  messagingSenderId: "798563162428",
  appId: "1:798563162428:web:143d5fec7923a927e66639",
  measurementId: "G-WCRFXQN9X3"

}

const agoraConfig: AgoraConfig = {
  AppID: '3a858c37dd19440a9bb6e7ecd50b6ca9',
};
//AppID: '3a858c37dd19440a9bb6e7ecd50b6ca9',
//
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    HttpClientModule,
    CalendarModule,
    NgOtpInputModule,
    FacebookModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularAgoraRtcModule.forRoot(agoraConfig),
    IonicModule.forRoot({ mode: 'ios' }),
    AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    LaunchNavigator,
    EmbedVideo,
    YoutubeVideoPlayer,
    Camera,
    FilePath,
    EmailComposer,
    AngularFireAuth,
    AndroidPermissions,
    BackgroundMode,
    AudioManagement,
    NativeAudio,
    Crop,
    Network,
    FileChooser,
    LocalNotifications,
    Downloader,
    ForegroundService,
    Base64,
    PhotoViewer,
    Facebook,
    SocialSharing,
    GooglePlus,
    Badge,
    Push,
    Media,
    InAppBrowser,
    Stripe,
    BackgroundFetch,
    Keyboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
