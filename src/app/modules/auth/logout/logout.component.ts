import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import {DemoJWTAuthService} from '../_services/demoJWT-auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService,
              private demoJWTAuthService: DemoJWTAuthService) {
    // this.authService.logout();
    this.demoJWTAuthService.demoLogOut();
  }

  ngOnInit(): void {}
}
