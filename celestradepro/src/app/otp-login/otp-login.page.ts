import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-otp-login',
  templateUrl: './otp-login.page.html',
  styleUrls: ['./otp-login.page.scss'],
})
export class OtpLoginPage {
  phoneNumber: string;
  otp: string;
  otpSent: boolean = false;

  constructor(
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  async sendOtp() {
    try {
      const response = await this.http.post('http://localhost:4000/send-otp', { phone: this.phoneNumber }).toPromise();
      if (response['error']) throw new Error(response['error']);
      this.otpSent = true;
      this.presentAlert('Success', 'OTP sent to your phone');
    } catch (error) {
      console.error('Error sending OTP:', error);
      this.presentAlert('Error', error.message || error.error.message);
    }
  }

  async verifyOtp() {
    try {
      const response = await this.http.post('http://localhost:4000/verify-otp', { phone: this.phoneNumber, otp: this.otp }).toPromise();
      if (response['error']) throw new Error(response['error']);
      this.presentAlert('Success', 'Logged in successfully');
      // Redirect to another page or perform other actions
    } catch (error) {
      console.error('Error verifying OTP:', error);
      this.presentAlert('Error', error.message || error.error.message);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
