import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isDarkMode = false; // Default to light theme
  themeIcon: string = 'sunny'; // Default icon for light theme

  constructor(private userService: UserService,private router: Router) {}

  navigateToLandingPage()   
  {
     this.router.navigate(['/celestradepro/homes']);
   }

  ngOnInit() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const email = this.userService.getEmail(); // Get user's email
    if (email) {
      this.userService.getUserTheme(email).subscribe(
        (response: any) => {
          const storedTheme = response?.theme || 'light'; // Default to light theme if not set
          this.isDarkMode = storedTheme === 'dark';
          this.updateIcon(); // Update icon based on the fetched theme
          this.applyTheme(this.isDarkMode); // Apply the fetched theme
        },
        (error) => {
          console.error('Error fetching theme:', error);
          this.applyTheme(this.isDarkMode); // Apply default theme in case of error
        }
      );
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.updateIcon(); // Update icon after toggling theme
    this.applyTheme(this.isDarkMode);
    this.saveUserThemePreference();
  }

  private applyTheme(isDark: boolean) {
    document.body.classList.toggle('dark', isDark);
  }

  private saveUserThemePreference() {
    const email = this.userService.getEmail();
    if (email) {
      const theme = this.isDarkMode ? 'dark' : 'light';
      this.userService.updateUserTheme(email, theme).subscribe(
        () => console.log('Theme updated successfully'),
        (error) => console.error('Error updating theme:', error)
      );
    }
  }

  private updateIcon() {
    this.themeIcon = this.isDarkMode ? 'moon' : 'sunny'; // Update icon based on the theme
  }
}
