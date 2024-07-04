import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private navCtrl: NavController) {}

  async signIn() {
    try {
      const error = await this.authService.signIn(this.email, this.password);
      if (error) {
        this.errorMessage = 'Invalid email or password';
      } else {
        // Navigate to the home page or any other desired page on successful login
        this.navCtrl.navigateRoot('/tabs/tab1');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      this.errorMessage = 'An unexpected error occurred';
    }
  }

  goToSignUp() {
    this.navCtrl.navigateForward('/signup'); // Navigate to the sign-up page
  }
}
