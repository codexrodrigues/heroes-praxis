import { HttpInterceptorFn } from '@angular/common/http';

// Ensure cookies (JWT session) are included on all requests
export const withCredentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const reqWithCreds = req.clone({ withCredentials: true });
  return next(reqWithCreds);
};

