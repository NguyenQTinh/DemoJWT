import {HttpClient} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {UserModel} from '../_models/user.model';
import {DftUserModel} from '../_models/dftUser.model';
import jwtDecode from 'jwt-decode';
import {map} from 'rxjs/operators';

// @ts-ignore
@Injectable({
    providedIn: 'root',
})

// Custom DemoJWTAuthService
export class DemoJWTAuthService implements OnDestroy {

    constructor(private http: HttpClient,
                private router: Router,
    ) {
        // this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('token')));
        this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.getInforUserToken();
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

    private unsubscribe: Subscription[] = [];
    currentUserSubject: BehaviorSubject<UserModel>;
    currentUser$: Observable<UserModel>;

    token = `${environment.appVersion}-${environment.USERDATA_KEY}`; // key token mặc định

    testString?: any = {
        token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzeXNhZG1pbkB0aGluZ3Nib2FyZC5vcmciLCJzY29wZXMiOlsiU1lTX0FETUlOIl0sInVzZXJJZCI6ImRkOWM5ZmMwLTU3NjctMTFlYy1hMTQxLWExZjM4MTFhMjQ2ZCIsImZpcnN0TmFtZSI6IiIsImxhc3ROYW1lIjoiU1lTVEVNIEFETUlOIiwiZW5hYmxlZCI6dHJ1ZSwiaXNQdWJsaWMiOmZhbHNlLCJ0ZW5hbnRJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTY1MDQyOTkyMywiZXhwIjoxNjUwNDM4OTIzfQ.8gUsS8MUds5tAT7ra6IcYiN5YivFYwrUyiV6P9RJ4bxA4sde5T8pYJWaIzwGmL2lf-N4ydy37NBmwbjA9j8pQA',
        refreshToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ2YW5iaW5oZG9hbjk3MUBnbWFpbC5jb20iLCJzY29wZXMiOlsiUkVGUkVTSF9UT0tFTiJdLCJ1c2VySWQiOiI3MTlmYWIyMC04ZGIxLTExZWMtYjQzYi1mNTMyODA0NDFmZmMiLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiNzE0NzUxZjAtOGRiMS0xMWVjLWI0M2ItZjUzMjgwNDQxZmZjIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwianRpIjoiMmE4MzY5Y2MtOGZiNS00YmJkLWIwNDMtZDNjOTg2ZDBkNzRlIiwiaWF0IjoxNjUwNTEwOTQzLCJleHAiOjE2NTExMTU3NDN9.guGzZD2AIQgQAzHj11ZXE51p-hvl2s56y1cRWtD3DmwlpjVPhUafztRSnbCGhGu3WWDfcYYJuHj-G_k5zAWoMw'
    };

    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }

    // Khi thành công api trả về chi tiết người dùng và JWT + refreshToken,
    // Và được công bố cho tất cả subscribers khi gọi đến this.currentUserSubject.next(user);// withCredentials
    demoLogIn(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, {username, password}).pipe(
            map(user => {
                console.log(user);
                localStorage.setItem('tokenAll', JSON.stringify(user));
                localStorage.setItem('token1', user.token);
                localStorage.setItem('refreshToken1', user.refreshToken);

                this.currentUserSubject.next(user);
                return user; // return token old
            })
        );
    }

    demoLogOut() {
        // remove user from local storage to log user out
        alert('Bạn sẽ logout');
        localStorage.removeItem('tokenAll');
        this.currentUserSubject.next(null);
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
        return this.http.post<any>(`${environment.apiUrl}/auth/token`,
            {
                token: this.getToken(),
                refreshToken: this.getRefreshToken()
            });
        // .subscribe(res => console.log(res)
        // );
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

    getAllClGroupService(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + '/clAlarm?page=0&pageSize=10');
    }
}

// key: token - value:......
// https://viblo.asia/q/cau-hoi-ve-cach-luu-refresh-token-va-quy-trinh-cua-token-va-refresh-token-eVKBMWVd5kW
// https://www.bezkoder.com/angular-12-refresh-token/#Angular_12_Refresh_Token_with_Interceptor
