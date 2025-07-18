import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language.service';
import { Observable, map } from 'rxjs';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed = true;
  logoPath$: Observable<string>;
  currentLang$: Observable<'te' | 'en'>;
  currentLanguage = 'te';
  
  // Define all possible metadata properties
  public NEWS_CATEGORIES_REGIONAL: any[] = [];

  constructor(private languageService: LanguageService, private publicService: PublicService) {
    this.currentLang$ = this.languageService.currentLang$;
    this.logoPath$ = this.currentLang$.pipe(
      map(lang => `assets/images/branding/${lang}.png`)
    );
  }

  ngOnInit(): void {
    // Set Telugu as default language
    // this.languageService.setLanguage('te');

    // Subscribe to language changes
    this.currentLang$.subscribe(lang => {
      this.currentLanguage = lang;
      console.log('Current Language:', this.currentLanguage);
    });

    const metaDataList = ['NEWS_CATEGORIES_REGIONAL'];
    this.getMetaData(metaDataList);
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  getString(key: string): string {
    return this.languageService.getString(key as any);
  }

  switchLanguage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    console.log(select.value, 'ennnnn')
    this.languageService.setLanguage(select.value as 'en' | 'te');
  }

  getMetaData(list: string[]): void {
    type MetaDataKey = 'NEWS_CATEGORIES_REGIONAL';
    
    this.publicService.getMetaData({ metaList: list })
      .subscribe(response => {
        list.forEach((key: string) => {
          const typedKey = key as MetaDataKey;
          if (response && response[typedKey]) {
            this[typedKey] = response[typedKey];
          }
        });
        console.log("Response Nav", response);
      });
  }
}
