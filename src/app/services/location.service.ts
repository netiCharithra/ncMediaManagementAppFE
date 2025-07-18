import { Injectable } from '@angular/core';

export interface VisitorLocation {
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor() {}

  /**
   * Get user's current geolocation using browser API.
   * Returns Promise<VisitorLocation | null>
   */
  getLocation(): Promise<VisitorLocation | null> {
    return new Promise((resolve) => {
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
