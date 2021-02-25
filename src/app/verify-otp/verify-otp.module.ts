import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyOtpPageRoutingModule } from './verify-otp-routing.module';
import { NgOtpInputModule } from  'ng-otp-input';

import { VerifyOtpPage } from './verify-otp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgOtpInputModule,
    VerifyOtpPageRoutingModule
  ],
  declarations: [VerifyOtpPage]
})
export class VerifyOtpPageModule {}
