import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed = true;
  logoPath$: Observable<string>;
  currentLang$: Observable<'te' | 'en'>;

  constructor(private languageService: LanguageService) {
    this.currentLang$ = this.languageService.currentLang$;
    this.logoPath$ = this.currentLang$.pipe(
      map(lang => `assets/images/branding/${lang}.png`)
    );
  }

  ngOnInit(): void {
    // Set Telugu as default language
    this.languageService.setLanguage('te');
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  getString(key: string): string {
    return this.languageService.getString(key as any);
  }

  switchLanguage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.languageService.setLanguage(select.value as 'en' | 'te');
  }
}
