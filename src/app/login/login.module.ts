import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgNumericKeyboardModule } from 'ng-numeric-keyboard';
import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AngularFireAuth } from 'angularfire2/auth';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    NgNumericKeyboardModule
  ],
  declarations: [LoginPage],
  providers: [GooglePlus,Facebook,AngularFireAuth]
})
export class LoginPageModule {}
