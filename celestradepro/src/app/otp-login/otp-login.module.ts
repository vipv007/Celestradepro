import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpLoginPageRoutingModule } from './otp-login-routing.module';

import { OtpLoginPage } from './otp-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpLoginPageRoutingModule
  ],
  declarations: [OtpLoginPage]
})
export class OtpLoginPageModule {}
