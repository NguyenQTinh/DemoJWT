import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../../../core';
import { UserModel } from '../../../../../../modules/auth/_models/user.model';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
import {DemoJWTAuthService} from '../../../../../../modules/auth/_services/demoJWT-auth.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  user$: Observable<UserModel>;

  constructor(
      private router: Router,
      private layout: LayoutService,
      private auth: AuthService,
      private demoJWTService: DemoJWTAuthService) {}

  ngOnInit(): void {
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );
    this.user$ = this.auth.currentUserSubject.asObservable();
    // this.user$ = this.demoJWTService.currentUserSubject.asObservable();
  }

  logout() {
    // this.auth.logout();
    this.demoJWTService.demoLogOut();
    this.router.navigate(['/auth/login']);
    // document.location.reload();
  }
}
