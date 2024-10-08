import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqemdkeyervllskrrmnm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZW1ka2V5ZXJ2bGxza3JybW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE0MjUwMzIsImV4cCI6MjAyNzAwMTAzMn0.BUfiUmRa_er1OTZx_ww1Nmp0y4uUNW7-SifOwkwcxpk';

@Injectable({
  providedIn: 'root'
})

export class SupabaseService {
  supabase = createClient(supabaseUrl, supabaseKey);

  constructor() { }

  signInWithOtp(phone: string) {
    return this.supabase.auth.signInWithOtp({ phone });
  }

  verifyOtp(phone: string, token: string) {
    return this.supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  }
}
