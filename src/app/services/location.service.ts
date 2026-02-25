import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface VisitorLocation {
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Get user's current geolocation using browser API.
   * Returns Promise<VisitorLocation | null>
   * On the server (SSR), resolves immediately with null – navigator is not available in Node.js.
   */
  getLocation(): Promise<VisitorLocation | null> {
    return new Promise((resolve) => {
      if (!this.isBrowser) {
        resolve(null);
        return;
      }

      if (!navigator.geolocation) {
        console.warn('[LocationService] Geolocation is not supported by this browser.');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: VisitorLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          resolve(coords);
        },
        (error) => {
          console.warn('[LocationService] Failed to get location:', error.message);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  }
}
