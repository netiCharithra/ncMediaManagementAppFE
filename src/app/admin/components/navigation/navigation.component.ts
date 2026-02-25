import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DataStore } from '../../store/data.store';
import { LanguageService } from '../../../services/language.service';
import { filter, map } from 'rxjs/operators';
import { NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isExpanded = false;
  isMobile = window.innerWidth <= 768;
  userData$: Observable<any>;
  currentLanguage: 'te' | 'en';
  breadcrumbs: Array<{ label: string; url: string }> = [];

  constructor(
    private authService: AuthService,
    private dataStore: DataStore,
    private router: Router,
    public languageService: LanguageService
  ) {
    this.userData$ = this.dataStore.userData$;
    this.currentLanguage = this.languageService.getCurrentLanguage();

    // Subscribe to language changes
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLanguage = lang;
      this.updateBreadcrumbs(); // Refresh labels on language change
    });

    // Listen to route changes for breadcrumbs
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    // Auto collapse when switching to mobile
    if (!wasMobile && this.isMobile && this.isExpanded) {
      this.isExpanded = false;
    }
  }

  toggleMenu(): void {
    this.isExpanded = !this.isExpanded;
  }

  logout(): void {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      this.authService.logout();
      this.router.navigate(['/admin/login']);
    }
  }

  switchLanguage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.languageService.setLanguage(select.value as 'en' | 'te');
  }

  // Check if user has access to WhatsApp Bot Linking (CEO and InCharge CEO only)
  canAccessWhatsAppBot(user: any): boolean {
    if (!user || !user.role) {
      return false;
    }
    const allowedRoles = ['CEO', 'InCharge CEO'];
    return allowedRoles.includes(user.role);
  }

  private updateBreadcrumbs(): void {
    const root = this.router.routerState.snapshot.root;
    this.breadcrumbs = [];
    this.addBreadcrumb(root, '');
  }

  private addBreadcrumb(route: any, url: string): void {
    const children: any[] = route.children;

    if (children.length === 0) {
      return;
    }

    for (const child of children) {
      const routeURL: string = child.url.map((segment: any) => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Try to get translate-friendly label
      const label = child.data['title'] || routeURL;

      if (label) {
        // Map common labels to translations if available
        const translatedLabel = this.languageService.getString(this.camelize(label) as any) || label;
        this.breadcrumbs.push({ label: translatedLabel, url: url });
      }

      this.addBreadcrumb(child, url);
    }
  }

  private camelize(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word: string, index: number) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '').replace(/-/g, '');
  }
}
