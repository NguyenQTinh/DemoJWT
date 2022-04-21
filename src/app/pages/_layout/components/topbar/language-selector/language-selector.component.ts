import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import {catchError, filter, tap} from 'rxjs/operators';
import { TranslationService } from '../../../../../modules/i18n/translation.service';
import {DemoJWTAuthService} from '../../../../../modules/auth/_services/demoJWT-auth.service';
import {of, Subscription} from 'rxjs';

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
  language: LanguageFlag;
  languages: LanguageFlag[] = [
    {
      lang: 'en',
      name: 'English',
      flag: './assets/media/svg/flags/226-united-states.svg',
    },
    {
      lang: 'ch',
      name: 'Mandarin',
      flag: './assets/media/svg/flags/015-china.svg',
    },
    {
      lang: 'es',
      name: 'Spanish',
      flag: './assets/media/svg/flags/128-spain.svg',
    },
    {
      lang: 'jp',
      name: 'Japanese',
      flag: './assets/media/svg/flags/063-japan.svg',
    },
    {
      lang: 'de',
      name: 'German',
      flag: './assets/media/svg/flags/162-germany.svg',
    },
    {
      lang: 'fr',
      name: 'French',
      flag: './assets/media/svg/flags/195-france.svg',
    },
  ];

  private subscriptions: Subscription[] = [];
  constructor(
    private translationService: TranslationService,
    private router: Router,
    private demoJWTService: DemoJWTAuthService
  ) { }

  ngOnInit() {
    this.setSelectedLanguage();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        this.setSelectedLanguage();
      });
  }

  setLanguageWithRefresh(lang) {
    this.setLanguage(lang);
    window.location.reload();
  }

  setLanguage(lang) {
    this.languages.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
    this.translationService.setLanguage(lang);
  }

  logOut() {
    this.demoJWTService.demoLogOut();
    this.router.navigate(['/auth/login']);
  }

  getClAlarm() {
    alert('chao Tinh');
    const sbgetClalarm = this.demoJWTService.getAllClGroupService().pipe(
      tap (res => {
        console.log('Giá trị: ', res);
      }),
      catchError( (err) => {
                   return of(err);
      })
    ).subscribe(res => console.log('subscribe: ', res));
    this.subscriptions.push(sbgetClalarm);
  }

  setSelectedLanguage(): any {
    this.setLanguage(this.translationService.getSelectedLanguage());
  }
}
