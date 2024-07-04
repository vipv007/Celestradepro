import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service'; // Import your Supabase service
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
})
export class SignupPage {
  email: string = '';
  password: string = '';
  givenName: string = '';
  familyName: string = '';
  gender: string = '';
  phone: string = '';
  code: string = '';
  showCodeInput: boolean = false;
  hasLowercase: string = 'Include lowercase characters';
  hasUppercase: string = 'Include at least 1 uppercase character';
  hasNumber: string = 'Include at least 1 number';
  hasSymbol: string = 'Include at least 1 symbol';
  hasMinLength: string = 'Minimum 8 characters';

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private toastController: ToastController,
    private supabaseService: SupabaseService // Inject your Supabase service
  ) {}

  async handleSignUp() {
    try {
      const { email, password, givenName, familyName, gender, phone } = this;
      const { data, error } = await this.supabaseService.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            given_name: givenName,
            family_name: familyName,
            gender: gender,
            phone:  phone,
          }
        }
      });

      if (error) {
        throw error;
      }

      const { session, user } = data;

      // Handle successful signup
      this.toastMessage('Signup successful. Please check your email for a confirmation code');
      this.showCodeInput = true;
    } catch (error) {
      console.error('Signup failed:', error);
      this.toastMessage('Signup failed. ' + error.message);
    }
  }

  async submitCode() {
    try {
      const { email, code } = this;
      const { data, error } = await this.supabaseService.supabase.auth.verifyOtp({ email, token: code, type: 'email' });

      if (error) {
        throw error;
      }

      const { user } = data;

      // Handle successful code submission
      this.toastMessage('Code verified. Logging in...');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error confirming signup:', error);
      this.toastMessage('Error confirming signup: ' + error.message);
    }
  }

  formatPhone(input: string) {
    // Format phone number function implementation
  }

  validatePassword(input: string) {
    // Validate password function implementation
  }

  async toastMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  goToLogin() {
    this.navCtrl.navigateForward('/login'); // Navigate to the sign-up page
  }
}
