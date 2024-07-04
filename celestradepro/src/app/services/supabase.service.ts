import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient;

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient('https://hqemdkeyervllskrrmnm.supabase.co',
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZW1ka2V5ZXJ2bGxza3JybW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE0MjUwMzIsImV4cCI6MjAyNzAwMTAzMn0.BUfiUmRa_er1OTZx_ww1Nmp0y4uUNW7-SifOwkwcxpk');
  }
}
