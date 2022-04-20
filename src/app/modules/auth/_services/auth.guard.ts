import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import {DemoJWTAuthService} from './demoJWT-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private demoJWTAuthService: DemoJWTAuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.demoJWTAuthService.currentUserValue;
    if (currentUser) {
      return true;  // đc truy cập vào ko bị chặn
    }

    this.demoJWTAuthService.demoLogOut();
    return false; // chưa thì quay lại login
  }

  //
  //   // not logged in so redirect to login page with the return url
  //   this.authService.logout();
  //   return false;
  // }
}
