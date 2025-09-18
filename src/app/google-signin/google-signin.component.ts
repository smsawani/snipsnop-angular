import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Observable, Subscription } from 'rxjs';
import { User } from '../auth.service';
import { environment } from '../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-google-signin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-container">
      @if (!(user$ | async)) {
        <div #googleButton id="google-signin-button"></div>
      } @else {
        <div class="user-info">
          <img
            [src]="(user$ | async)?.picture"
            [alt]="(user$ | async)?.name"
            class="user-avatar rounded-circle"
            width="28"
            height="28">
          <span class="user-name text-light">{{ (user$ | async)?.name }}</span>
          <button
            class="btn btn-outline-light btn-sm sign-out-btn"
            (click)="signOut()">
            Sign Out
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      align-items: center;
      height: 40px;
    }

    #google-signin-button {
      cursor: pointer;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 4px 8px;
      border-radius: 6px;
      background-color: rgba(255, 255, 255, 0.1);
      white-space: nowrap;
    }

    .user-avatar {
      border: 2px solid rgba(255, 255, 255, 0.3);
      flex-shrink: 0;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      flex-shrink: 0;
    }

    .sign-out-btn {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      flex-shrink: 0;
      height: 28px;
      line-height: 1;
    }

    .sign-out-btn:hover {
      background-color: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
    }
  `]
})
export class GoogleSigninComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('googleButton', { static: false }) googleButton!: ElementRef;
  user$: Observable<User | null>;
  private userSubscription?: Subscription;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.userSubscription = this.user$.subscribe(user => {
      if (!user) {
        // User signed out, re-render button after a short delay
        setTimeout(() => this.renderGoogleButton(), 100);
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadGoogleScript();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  private loadGoogleScript(): void {
    if (typeof google !== 'undefined') {
      this.renderGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.renderGoogleButton();
    };
    document.head.appendChild(script);
  }

  private renderGoogleButton(): void {
    if (this.googleButton?.nativeElement && typeof google !== 'undefined') {
      // Clear existing button content
      this.googleButton.nativeElement.innerHTML = '';

      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleCredentialResponse(response),
        auto_select: false,
        cancel_on_tap_outside: false
      });

      google.accounts.id.renderButton(this.googleButton.nativeElement, {
        theme: 'outline',
        size: 'medium',
        type: 'standard',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '200'
      });
    }
  }

  private handleCredentialResponse(response: any): void {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const user: User = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    };
    this.authService.setUser(user);
  }

  signOut(): void {
    this.authService.signOut();
  }
}