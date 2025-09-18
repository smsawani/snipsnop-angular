import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

declare const google: any;

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private isInitialized = false;
  private readonly USER_STORAGE_KEY = 'snipsnop_user';

  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
    this.initializeGoogleSignIn();
  }

  private loadUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        this.userSubject.next(user);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      localStorage.removeItem(this.USER_STORAGE_KEY);
    }
  }

  private saveUserToStorage(user: User | null): void {
    try {
      if (user) {
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  private async initializeGoogleSignIn(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.handleCredentialResponse(response),
          auto_select: false,
          cancel_on_tap_outside: false
        });
        this.isInitialized = true;
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  private handleCredentialResponse(response: any): void {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const user: User = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    };
    this.setUser(user);
  }

  async signIn(): Promise<void> {
    await this.initializeGoogleSignIn();

    // Use renderButton instead of prompt to avoid FedCM issues
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'google-signin-button';
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '-9999px';
    document.body.appendChild(buttonContainer);

    google.accounts.id.renderButton(buttonContainer, {
      theme: 'outline',
      size: 'large',
      type: 'standard'
    });

    // Trigger click programmatically
    const button = buttonContainer.querySelector('div[role="button"]') as HTMLElement;
    if (button) {
      button.click();
    }

    // Clean up
    setTimeout(() => {
      document.body.removeChild(buttonContainer);
    }, 100);
  }

  signOut(): void {
    if (typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.disableAutoSelect();
    }
    this.setUser(null);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  setUser(user: User | null): void {
    this.userSubject.next(user);
    this.saveUserToStorage(user);
  }
}