import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // Key must match where token is stored
  console.log('Interceptor token:', token); // Debug

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`  , // Format: "Bearer <token>"
      }
    });
    return next(authReq);
  }else{
    console.log(token); // Debug
  }
  return next(req);
};