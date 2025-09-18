import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GoogleSigninComponent } from '../google-signin/google-signin.component';

@Component({
    selector: 'app-top-bar',
    imports: [RouterModule, GoogleSigninComponent],
    templateUrl: './top-bar.component.html',
    styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
} 