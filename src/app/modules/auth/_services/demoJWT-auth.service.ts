import {HttpClient} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {AuthHTTPService} from './auth-http';
import {environment} from '../../../../environments/environment';
import {UserModel} from '../_models/user.model';
import {DftUserModel} from '../_models/dftUser.model';
import jwtDecode from 'jwt-decode';
import {map} from 'rxjs/operators';
import {AuthModel} from '../_models/auth.model';

// @ts-ignore
@Injectable({
    providedIn: 'root',
})

// Custom DemoJWTAuthService
export class DemoJWTAuthService implements OnDestroy {
    private unsubscribe: Subscription[] = [];
    currentUserSubject: BehaviorSubject<UserModel>;
    currentUser$: Observable<UserModel>;

    token = `${environment.appVersion}-${environment.USERDATA_KEY}`; // key token mặc định

    constructor(private http: HttpClient,
                private router: Router,
                private authHttpService: AuthHTTPService,
    ) {
        // this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('token')));
        this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.getInforUserToken();
    }

    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }

    // Cho phép các thành phần khác nhanh chóng nhận được giá tri của user hiện tại
    // mà ko cần phải đăng ký để người dùng có thể quan sát được
    public get currentUserValue(): UserModel {
        return this.currentUserSubject.value;
    }

    public set currentUserValue(user: UserModel) {
        // @ts-ignore
        return this.currentUserSubject.next(user);
    }

    // Khi thành công api trả về chi tiết người dùng và JWT + refreshToken,
    // Và được công bố cho tất cả subscribers khi gọi đến this.currentUserSubject.next(user);// withCredentials
    demoLogIn(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, {username, password}).pipe(
            map(user => {
                console.log(user);
                localStorage.setItem(this.token, JSON.stringify(user));
                localStorage.setItem('token1', JSON.stringify(user.token));
                localStorage.setItem('refreshToken1', JSON.stringify(user.refreshToken));

                // const result = this.setAuthFromLocalStorage(user);
                this.currentUserSubject.next(user);
                // return result;
                return user;
            })
        );
    }

    demoLogOut() {
        // remove user from local storage to log user out
        alert('Bạn sẽ logout');
        localStorage.removeItem(this.token);
        this.currentUserSubject.next(null);
        // this.router.navigate(['/login']);
        this.router.navigate(['/auth/login'], {
            queryParams: {},
        });
    }

    getToken() {
        return localStorage.getItem('token1');
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken1');
    }

    // refreshToken
    demoRefreshToken(): Observable<any> {
        // @ts-ignore
        return this.http.post<any>(`${environment.apiUrl}/auth/refreshtoken`,
            {
                token: this.getToken(),
                refreshToken: this.getRefreshToken()
            })
            .subscribe(res => console.log(res)
            );
    }

    // lưu data payload
    private getInforUserToken(): DftUserModel {
        const tokenstr = localStorage.getItem(this.token);
        if (tokenstr === null) {
            return null;
        }

        // giải mã token
        const tokenPayload: any = jwtDecode(tokenstr);
        const dftUserModel: DftUserModel = {
            username: tokenPayload.username,
            name: tokenPayload.name,
            lastName: tokenPayload.lastName,
            sub: tokenPayload.sub,
            customerId: tokenPayload.customerId,
            iss: tokenPayload.iss,
            iat: tokenPayload.iat,
            exp: tokenPayload.exp,
        };
        console.log('Data Payload: ', dftUserModel); // log thành công
        return dftUserModel;
    }
}

// key: token - value:......
// https://viblo.asia/q/cau-hoi-ve-cach-luu-refresh-token-va-quy-trinh-cua-token-va-refresh-token-eVKBMWVd5kW
// https://www.bezkoder.com/angular-12-refresh-token/#Angular_12_Refresh_Token_with_Interceptor
