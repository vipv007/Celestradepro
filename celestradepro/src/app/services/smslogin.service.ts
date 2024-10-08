import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SmsloginService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://owvrfaxsxrwgvmemjjow.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93dnJmYXhzeHJ3Z3ZtZW1qam93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI1MTEyMDQsImV4cCI6MjAzODA4NzIwNH0.0OZaA4vm_h_WTgm2CPg8zN7hz-tLeNyNIc1fegsBcZU'
    );
  }

  async sendOTP(phone: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  async verifyOTP(phone: string, token: string) {
    try {
      const { data, error } = await this.supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }
}
