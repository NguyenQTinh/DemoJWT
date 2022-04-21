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
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private demoJWTService: DemoJWTAuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // letDemoJWTService = this.demoJWTService.

        // const token = JSON.parse(localStorage.getItem('token') as string);
        // const token = this.demoJWTService.getToken();
        // if (token) {
        //     // @ts-ignore
        //     request = request.clone({
        //         setHeaders: {Authorization: `Bearer ${token}`}
        //     });
        // }
        // // @ts-ignore
        // // đăng xuất
        // return next.handle(request);

        const token = this.addTokenHeader(req, this.demoJWTService.getToken());
        if (token != null) {
            this.addTokenHeader(req, token);
        }

        // xử lý khi hết hạn
        return next.handle(req).pipe(
            catchError (err => {
                console.log(err);
                if (err instanceof HttpErrorResponse && err.status === 401) {
                    console.log(err.status);
                    console.log(err.statusText);
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
            const token = this.demoJWTService.getRefreshToken();
            if (token) {
                return this.demoJWTService.demoRefreshToken().pipe(
                    switchMap((data: any) => {
                        console.log(data);
                        this.isRefreshing = false;
                        localStorage.setItem('token1', data.token);
                        localStorage.setItem('refreshToken1', data.refreshToken);
                        return next.handle(this.addTokenHeader(request, data.token1));
                    // data trả về token mới
                    // token1(cũ) = token mới
                    // refreshToken1(cũ) = refreshToken mới
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;
                        this.demoJWTService.demoLogOut();
                        return throwError(err);
                    })
                );
            }
        }
    }

    // Đính kèm token
    addTokenHeader(req: HttpRequest<any>, token: any) {
        return req.clone({
            headers: req.headers.set('Authorization', 'bear' + token),
        });
    }

}
