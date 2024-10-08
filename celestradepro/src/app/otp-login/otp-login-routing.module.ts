import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpLoginPage } from './otp-login.page';

const routes: Routes = [
  {
    path: '',
    component: OtpLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpLoginPageRoutingModule {}
