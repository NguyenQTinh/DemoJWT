import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {catchError, first} from 'rxjs/operators';
import {AuthService} from '../_services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DemoJWTAuthService} from '../_services/demoJWT-auth.service';
import {UserModel} from '../_models/user.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    defaultAuth: any = {
        email: 'admin@demo.com',
        password: 'demo',
    };
    loginForm: FormGroup;
    hasError: boolean;
    returnUrl: string;
    isLoading$: Observable<boolean>;

    // them
    responsedata: any;

    // private fields
    private unsubscribe: Subscription[] = [];

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private demoJWTAuthService: DemoJWTAuthService
    ) {
        this.isLoading$ = this.authService.isLoading$;
        // redirect to home if already logged in
        if (this.authService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit(): void {
        this.initForm();
        // get return url from route parameters or default to '/'
        this.returnUrl =
            this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    // initForm() {
    //   this.loginForm = this.fb.group({
    //     email: [],
    //     password: [],
    //   });
    // }
    //
    // submit() {
    //   this.hasError = false;
    //   const loginSubscr = this.authService
    //     .login(this.f.email.value, this.f.password.value)
    //     .pipe(first())
    //     .subscribe((user: UserModel) => {
    //       if (user) {
    //         this.router.navigate([this.returnUrl]);
    //       } else {
    //         this.hasError = true;
    //       }
    //     });
    //   this.unsubscribe.push(loginSubscr);
    // }


    initForm() {
        this.loginForm = this.fb.group({
            username: [''],
            password: [''],
        });
    }

    submit() {
        this.hasError = false;
        const loginSubscr = this.demoJWTAuthService.demoLogIn(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe((user: UserModel) => {
                if (user) {
                    alert('Đăng nhập thành công');
                    // this.router.navigate([this.returnUrl]);
                    this.router.navigate(['/builder']);
                } else {
                    this.hasError = true;
                }
            });
        this.unsubscribe.push(loginSubscr);
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}
