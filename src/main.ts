import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DatePipe, DecimalPipe, CurrencyPipe, PercentPipe, UpperCasePipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { provideEnvironmentInitializer } from '@angular/core';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { withCredentialsInterceptor } from './app/core/interceptors/with-credentials.interceptor';
import { csrfInterceptor } from './app/core/interceptors/csrf.interceptor';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { API_URL, ApiUrlConfig, GenericCrudService } from '@praxisui/core';
import { providePraxisDynamicFields } from '@praxisui/dynamic-fields';
import { providePraxisTableMetadata } from '@praxisui/table';
import { providePraxisDynamicFormMetadata } from '@praxisui/dynamic-form';
import { providePraxisCrudMetadata } from '@praxisui/crud';
import { providePraxisListMetadata } from '@praxisui/list';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(APP_ROUTES, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    // Praxis UI core config: API base (relative with dev proxy)
    { provide: API_URL, useValue: ({ default: { baseUrl: '/api' } }) as ApiUrlConfig },
    // Praxis UI dynamic fields (ensures width 100% internally and sets up HttpClient where needed)
    providePraxisDynamicFields(),
    // Praxis UI metadata registries (recommended)
    providePraxisTableMetadata(),
    providePraxisDynamicFormMetadata(),
    providePraxisCrudMetadata(),
    providePraxisListMetadata(),
    GenericCrudService,
    // Formatting pipes required by Praxis Table's DataFormattingService
    DatePipe, DecimalPipe, CurrencyPipe, PercentPipe, UpperCasePipe, LowerCasePipe, TitleCasePipe,
    provideHttpClient(
      withInterceptors([
        withCredentialsInterceptor,
        csrfInterceptor,
        authInterceptor,
      ]),
    ),
    // Headers for lightweight fetchWithETag in Praxis core
    provideEnvironmentInitializer(() => () => {
      (globalThis as any).PAX_FETCH_HEADERS = () => ({
        Authorization: `Bearer ${localStorage.getItem('pax.api.token') || ''}`,
        'X-Tenant': localStorage.getItem('pax.api.tenant') || 'demo',
        'Accept-Language': navigator.language || 'pt-BR',
      });
    }),
  ],
}).catch((err) => console.error(err));
