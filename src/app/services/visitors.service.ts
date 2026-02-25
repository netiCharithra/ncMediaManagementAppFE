import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VisitorsService {
  private readonly visitorIdKey = 'visitorId';
  private readonly visitEndpoint = '/api/visit';
  private readonly isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getOrCreateVisitorId(): string {
    // localStorage is not available in SSR (Node.js environment)
    if (!this.isBrowser) return 'ssr-visitor';

    let id = localStorage.getItem(this.visitorIdKey);
    if (!id) {
      id = this.generateVisitorIdWithTimestamp();
      localStorage.setItem(this.visitorIdKey, id);
    }
    return id;
  }

  private generateVisitorIdWithTimestamp(): string {
    const epoch = Date.now();
    const random = Math.random().toString(36).substring(2, 12);
    return `visitor-${epoch}-${random}`;
  }
}
