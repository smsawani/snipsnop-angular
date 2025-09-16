import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
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
        <div class="d-flex align-items-center gap-3">
          <img
            [src]="(user$ | async)?.picture"
            [alt]="(user$ | async)?.name"
            class="rounded-circle"
            width="32"
            height="32">
          <span class="text-light">{{ (user$ | async)?.name }}</span>
          <button
            class="btn btn-outline-light btn-sm"
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
    }

    #google-signin-button {
      cursor: pointer;
    }
  `]
})
export class GoogleSigninComponent implements OnInit, AfterViewInit {
  @ViewChild('googleButton', { static: false }) googleButton!: ElementRef;
  user$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadGoogleScript();
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