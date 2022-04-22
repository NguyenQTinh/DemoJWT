// @ts-ignore

import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {DemoJWTAuthService} from './demoJWT-auth.service';
import {catchError, switchMap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any>;

    constructor(private demoJWTService: DemoJWTAuthService) {
        this.refreshTokenSubject = new BehaviorSubject<any>(null);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.addTokenHeader(req, localStorage.getItem('token1'));
        if (token != null) {
            this.addTokenHeader(req, token);
        }

        // xử lý khi hết hạn
        return next.handle(token).pipe(
            catchError(err => {
                if (err instanceof HttpErrorResponse && err.status === 401) {
                    console.log(err.status);
                    return this.handle401Error(req, next);
                }
                console.log(err);
                return throwError(err);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            const refToken = this.demoJWTService.getRefreshToken();
            if (refToken) {
                return this.demoJWTService.demoRefreshToken().pipe(
                    switchMap((data: any) => {
                        this.isRefreshing = false;
                        localStorage.setItem('tokenAll', data);
                        localStorage.setItem('token1', data.token);
                        localStorage.setItem('refreshToken1', data.refreshToken);
                        return next.handle(this.addTokenHeader(request, localStorage.getItem('token1')));
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;
                        this.demoJWTService.demoLogOut();
                        return throwError(err);
                    })
                );
                console.log('chua1');
            }
        }
    }

    // Đính kèm token
    addTokenHeader(req: HttpRequest<any>, token: any) {
        return req.clone({
            setHeaders: {Authorization: `Bearer ${token}`},
        });
    }
}

/* 1. check xem token còn hạn ko, gán mã lỗi === 401.
* gọi đên api rồi map lại
*
* */
