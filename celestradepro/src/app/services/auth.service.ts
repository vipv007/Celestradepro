import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, AuthError, PostgrestError, SignInWithPasswordCredentials } from '@supabase/supabase-js';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            'https://hqemdkeyervllskrrmnm.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZW1ka2V5ZXJ2bGxza3JybW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE0MjUwMzIsImV4cCI6MjAyNzAwMTAzMn0.BUfiUmRa_er1OTZx_ww1Nmp0y4uUNW7-SifOwkwcxpk'
        );
    }

    async signIn(emailOrPhone: string, password: string): Promise<AuthError | null> {
        try {
            let signInMethod: 'email' | 'phone';
            let signInOptions: SignInWithPasswordCredentials;
    
            // Check if the input looks like an email address
            if (/\S+@\S+\.\S+/.test(emailOrPhone)) {
                signInMethod = 'email';
                signInOptions = {
                    email: emailOrPhone,
                    password
                };
            } else {
                // Assume it's a phone number
                signInMethod = 'phone';
                signInOptions = {
                    phone: emailOrPhone,
                    password
                };
            }
    
            // Perform the sign-in with password
            const { error } = await this.supabase.auth.signInWithPassword(signInOptions);
            return error;
        } catch (error) {
            console.error('Sign-in error:', error);
            return error as AuthError;
        }
    }
    



    async signOut(): Promise<AuthError | null> {
        try {
            const { error } = await this.supabase.auth.signOut();
            return error;
        } catch (error) {
            console.error('Sign-out error:', error);
            return error as AuthError;
        }
    }
}
