import { HttpInterceptorFn } from '@angular/common/http';

// Adds Authorization (Bearer), X-Tenant and Accept-Language headers when available
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('pax.api.token');
  const tenant = localStorage.getItem('pax.api.tenant') || 'demo';
  const lang = navigator.language || 'pt-BR';

  const setHeaders: Record<string, string> = {};
  if (token && !req.headers.has('Authorization')) setHeaders['Authorization'] = `Bearer ${token}`;
  if (tenant && !req.headers.has('X-Tenant')) setHeaders['X-Tenant'] = tenant;
  if (lang && !req.headers.has('Accept-Language')) setHeaders['Accept-Language'] = lang;

  return next(Object.keys(setHeaders).length ? req.clone({ setHeaders }) : req);
};

