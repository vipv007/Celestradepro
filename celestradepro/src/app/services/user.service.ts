import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://celescontainerwebapp-staging.azurewebsites.net/api'; // Your backend URL
  private email: string | null = null;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // To track login status
  private loginExpirationDays = 2; // Set the number of days before automatic logout

  constructor(private http: HttpClient) {
    // Check localStorage when the service initializes
    this.checkAutoLogout();
  }

  // Set the email in the service and mark the user as logged in
  setEmail(email: string) {
    this.email = email;
    const loginDate = new Date().getTime();
    localStorage.setItem('userEmail', email); // Store email in localStorage
    localStorage.setItem('loginTimestamp', loginDate.toString()); // Store login timestamp
    this.isLoggedInSubject.next(true); // Update login status
  }

  // Check if more than 2 days have passed since the last login, and logout if necessary
  private checkAutoLogout() {
    const storedEmail = localStorage.getItem('userEmail');
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    
    if (storedEmail && loginTimestamp) {
      const loginTime = parseInt(loginTimestamp, 10);
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - loginTime;
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

      if (daysDifference >= this.loginExpirationDays) {
        this.logout(); // Automatically log out if 2 days have passed
      } else {
        this.email = storedEmail; // Restore email from localStorage
        this.isLoggedInSubject.next(true); // Mark as logged in
      }
    }
  }

  // Get the email from the service
  getEmail(): string | null {
    return this.email; // Returns null if not logged in
  }

  // Store the email in the backend
  storeEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/store-email`, { email });
  }

  // Get the watchlist for the provided email from the backend
  getWatchlist(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/watchlist/${email}`);
  }

  // Add items to the watchlist and update it in the backend
  addToWatchlist(email: string, watchlist: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-watchlist`, { email, watchlist });
  }

  // Remove items from the watchlist
  removeFromWatchlist(email: string, symbol: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove-from-watchlist`, { email, symbol });
  }

  // Fetch user theme from the backend
  getUserTheme(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-theme/${email}`);
  }

  // Update user theme in the backend
  updateUserTheme(email: string, theme: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-user-theme`, { email, theme });
  }

    getUserData(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email });
  }

  updateSelectedSections(email: string, selectedSections: string[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/update-selected-sections`, { email, selectedSections });
}


  // Get login state as an observable
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable(); // Return login status observable
  }

  // Check if the user is currently logged in (used to sync login state)
  isUserLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue(); // Return current login status
  }

  // Logout and clear the email
  logout() {
    this.email = null; // Clear email when logging out
    localStorage.removeItem('userEmail'); // Remove email from localStorage
    localStorage.removeItem('loginTimestamp'); // Remove login timestamp
    this.isLoggedInSubject.next(false); // Mark user as logged out
  }

  // userService.js
    archiveArticle(email: string, archivedArticle: any): Observable<any> {
        // Assuming you have an endpoint to handle archiving for users
        return this.http.post(`${this.apiUrl}/users/${email}/archive`, archivedArticle);
    }

    getArchivedArticles(email: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/archive/${email}`);
      
  }
  
   archiveArticleop(email: string, archivedArticleop: any): Observable<any> {
        // Assuming you have an endpoint to handle archiving for users
        return this.http.post(`${this.apiUrl}/users/${email}/archiveop`, archivedArticleop);
  }
  
  getArchivedArticlesop(email: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/archiveop/${email}`);
      
  }

  archiveArticlecom(email: string, archivedArticlecom: any): Observable<any> {
        // Assuming you have an endpoint to handle archiving for users
        return this.http.post(`${this.apiUrl}/users/${email}/archivecom`, archivedArticlecom);
  }
  
  getArchivedArticlescom(email: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/archivecom/${email}`);
      
  }

  archiveArticlefox(email: string, archivedArticlefox: any): Observable<any> {
        // Assuming you have an endpoint to handle archiving for users
        return this.http.post(`${this.apiUrl}/users/${email}/archivefox`, archivedArticlefox);
  }
  
  getArchivedArticlesfox(email: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/archivefox/${email}`);
      
  }
}
