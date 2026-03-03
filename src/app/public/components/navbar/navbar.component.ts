import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import { BannerService } from '../../../services/banner.service';
import { Observable, map } from 'rxjs';
import { PublicService } from '../../services/public.service';
import { NAV_CATEGORIES } from '../../../services/schema.service';

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
  isBannerVisible = false;
  today: Date = new Date();
  private clockInterval: any;

  // Define all possible metadata properties
  public NEWS_CATEGORIES_REGIONAL: any[] = [];

  constructor(
    private languageService: LanguageService,
    private publicService: PublicService,
    private bannerService: BannerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentLang$ = this.languageService.currentLang$;
    this.logoPath$ = this.currentLang$.pipe(
      map(lang => `assets/images/branding/${lang}.png`)
    );
  }

  ngOnInit(): void {
    // Live clock — only runs in the browser (setInterval keeps Zone alive on server)
    if (isPlatformBrowser(this.platformId)) {
      this.clockInterval = setInterval(() => {
        this.today = new Date();
      }, 1000);
    }

    // Subscribe to language changes
    this.currentLang$.subscribe(lang => {
      this.currentLanguage = lang;
    });

    if (isPlatformBrowser(this.platformId)) {
      this.bannerService.bannerVisible$.subscribe(visible => {
        this.isBannerVisible = visible;
      });

      const metaDataList = ['NEWS_CATEGORIES_REGIONAL'];
      this.getMetaData(metaDataList);
    }
  }

  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
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
      });
  }

  /**
   * Maps an API-returned category object to its SEO-friendly URL slug.
   * The API returns { label: 'Political', te: 'రాజకీయం', ... } but has no urlSlug.
   * We look it up from NAV_CATEGORIES (local source of truth) by matching label.
   *
   * Examples:
   *   { label: 'Political' }     → 'politics'
   *   { label: 'Entertainment' } → 'entertainment'
   *   { label: 'General' }       → 'general'
   *
   * Falls back to label.toLowerCase() only if the category is unknown,
   * which would be a backend data issue.
   */
  getNavSlug(category: any): string {
    const match = NAV_CATEGORIES.find(
      c => c.label.toLowerCase() === (category?.label ?? '').toLowerCase()
    );
    return match ? match.urlSlug : (category?.label ?? '').toLowerCase();
  }
}
