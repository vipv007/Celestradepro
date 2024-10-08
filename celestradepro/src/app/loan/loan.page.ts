import { Component } from '@angular/core';
import { SmsloginService } from '../services/smslogin.service';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.page.html',
  styleUrls: ['./loan.page.scss'],
})
export class LoanPage {
  phoneNumber: string = '';
  otp: string = '';
  otpSent: boolean = false;
  errorMessage: string = '';

  constructor(private smsloginService: SmsloginService) {}

  async sendOTP() {
    try {
      await this.smsloginService.sendOTP(this.phoneNumber);
      this.otpSent = true;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      this.errorMessage = error.message || 'An error occurred while sending the OTP.';
    }
  }

  async verifyOTP() {
    try {
      const response = await this.smsloginService.verifyOTP(this.phoneNumber, this.otp);
      console.log('Logged in:', response);
      // Handle successful login
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      this.errorMessage = error.message || 'An error occurred while verifying the OTP.';
    }
  }
}
