import { HttpInterceptorFn } from '@angular/common/http';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// Send CSRF token on state-changing methods if server has CSRF enabled
export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const method = req.method.toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = getCookie('XSRF-TOKEN');
    if (token && !req.headers.has('X-XSRF-TOKEN')) {
      req = req.clone({ setHeaders: { 'X-XSRF-TOKEN': token } });
    }
  }
  return next(req);
};

