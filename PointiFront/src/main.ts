import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/features/auth/interceptor/auth.interceptor';

bootstrapApplication(App, 
  {
    providers: [
      provideRouter(routes),
      HttpClient,
      provideHttpClient(withInterceptors([authInterceptor]))
      
      

    ],
  },
  )
  .catch((err) => console.error(err));
