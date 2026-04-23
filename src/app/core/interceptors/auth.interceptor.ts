import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const modifiedReq = req.clone({
    withCredentials: true
  });
  
  return next(modifiedReq);
};