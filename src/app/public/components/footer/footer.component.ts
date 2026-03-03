import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { LanguageService } from '../../../services/language.service';
import { PublicService } from '../../services/public.service';
import { isPlatformBrowser } from '@angular/common';
import { NAV_CATEGORIES, NavCategory } from '../../../services/schema.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  visitorCount: number = 0;

  /** Expose categories to template */
  categories: NavCategory[] = NAV_CATEGORIES;

  socialLinks = [
    { platform: 'facebook', icon: 'fab fa-facebook-f', url: 'https://facebook.com/neticharithra', label: 'Facebook' },
    { platform: 'twitter', icon: 'fab fa-twitter', url: 'https://twitter.com/neticharithra', label: 'Twitter / X' },
    { platform: 'instagram', icon: 'fab fa-instagram', url: 'https://instagram.com/neticharithra', label: 'Instagram' },
    { platform: 'youtube', icon: 'fab fa-youtube', url: 'https://youtube.com/neticharithra', label: 'YouTube' },
  ];

  constructor(
    private languageService: LanguageService,
    private publicService: PublicService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  getString(key: any): string {
    return this.languageService.getString(key);
  }

  get logoPath(): string {
    return 'assets/images/logos/logo-512x512.png';
  }

  ngOnInit(): void {
    // Skip API call on server — backend is unreachable during SSR and
    // a hanging HTTP request keeps the Zone open → 30s timeout.
    if (isPlatformBrowser(this.platformId)) {
      this.getVisitorCount();
    }
  }

  getVisitorCount(): void {
    this.publicService.getVisitorCount().subscribe(response => {
      if (response) {
        this.visitorCount = response || 0;
      }
    });
  }
}
