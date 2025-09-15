import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
  import { provideRouter } from '@angular/router';
  import { provideHttpClient } from '@angular/common/http';
  import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
  import { importProvidersFrom } from '@angular/core';
  import { ReactiveFormsModule } from '@angular/forms';

  import { routes } from './app.routes';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideHttpClient(),
      importProvidersFrom(ReactiveFormsModule),
      provideClientHydration(withEventReplay())
    ]
  };