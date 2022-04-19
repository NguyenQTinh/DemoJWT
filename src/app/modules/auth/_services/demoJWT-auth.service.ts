import {HttpClient} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {AuthHTTPService} from './auth-http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/internal/operators/map';
import {UserModel} from '../_models/user.model';

@Injectable({
    providedIn: 'root',
})

// Custom DemoJWTAuthService
export class DemoJWTAuthService implements OnDestroy {
    private unsubscribe: Subscription[] = [];

    currentUserSubject: BehaviorSubject<UserModel>;
    currentUser: Observable<UserModel>;

    constructor(private http: HttpClient,
                private router: Router,
                private authHttpService: AuthHTTPService,
    ) {
        this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
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
    // Và được công bố cho tất cả subscribers khi gọi đến this.currentUserSubject.next(user);
    // withCredentials
    demoLogIn(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, {username, password}, {withCredentials: true}).pipe(
            map(user => {
                console.log(user);
                // this.currentUserSubject.next(user);
                return user;
            })
        );
    }

    demoLogOut() {
        // remove user from local storage to log user out
        console.log('Logout thành công');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        // this.router.navigate(['/login']);
        this.router.navigate(['/auth/login'], {
            queryParams: {},
        });
    }
}


