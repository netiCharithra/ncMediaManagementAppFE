import { Component, Input, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type * as L from 'leaflet';
import { GeocodingService } from '../../services/geocoding.service';

@Component({
  selector: 'app-dashboard-map',

  templateUrl: './dashboard-map.component.html',
  styleUrl: './dashboard-map.component.scss'
})
export class DashboardMapComponent implements OnChanges {
  @Input() visitorLocations: any = [];

  private map: L.Map | undefined;
  private markerClusterGroup: L.MarkerClusterGroup | undefined;
  private markers: L.Marker[] = [];

  isLoading = true;
  rawCoordinates: any[] = [];

  private leaflet: typeof L | undefined;

  constructor(
    private geocodingService: GeocodingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      this.isLoading = false;
      return;
    }

    if (changes['visitorLocations'] && changes['visitorLocations'].currentValue) {
      this.rawCoordinates = this.visitorLocations || [];
      if (this.rawCoordinates.length > 0) {
        if (!this.leaflet) {
          this.leaflet = await import('leaflet');
          await import('leaflet.markercluster');
        }
        this.initMap();
        // Ensure map is fully initialized before loading markers
        setTimeout(() => this.loadMarkers(), 0);
      } else {
        this.isLoading = false;
      }
    }
  }

  private initMap(): void {
    if (!this.leaflet) return;
    const L = this.leaflet;

    this.map = L.map('map').setView([20.5937, 78.9629], 4.3); // Center on India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // @ts-ignore
    this.markerClusterGroup = L.markerClusterGroup();
    this.map?.addLayer(this.markerClusterGroup!);
  }

  private async loadMarkers(): Promise<void> {
    if (!this.leaflet) return;
    const L = this.leaflet;

    try {
      console.log('Loading markers, rawCoordinates:', this.rawCoordinates);

      // Always set loading to false after a maximum timeout to prevent infinite loading
      const loadingTimeout = setTimeout(() => {
        console.warn('Map loading timeout reached, forcing isLoading = false');
        this.isLoading = false;
      }, 10000); // 10 second timeout

      if (!this.rawCoordinates || this.rawCoordinates.length === 0) {
        console.log('No coordinates to load, setting isLoading = false');
        clearTimeout(loadingTimeout);
        this.isLoading = false;
        return;
      }

      // Define a custom icon with fallback
      let defaultIcon;
      try {
        defaultIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
      } catch (iconError) {
        console.warn('Failed to load custom icon, using default:', iconError);
        defaultIcon = new L.Icon.Default();
      }

      // Clear any existing markers
      this.markerClusterGroup?.clearLayers();
      this.markers = [];

      console.log(`Processing ${this.rawCoordinates.length} coordinates`);

      // Process coordinates with Promise.allSettled for better error handling
      const markerPromises = this.rawCoordinates.map(async (point, index) => {
        try {
          if (!point || typeof point.lat !== 'number' || typeof point.lng !== 'number') {
            console.warn(`Invalid coordinate at index ${index}:`, point);
            return;
          }

          const marker = L.marker([point.lat, point.lng], {
            title: `Location ${index + 1}`,
            icon: defaultIcon
          });

          // Add marker immediately with basic info
          const basicPopupContent = `
            <div style="min-width: 200px;">
              <strong>Location ${index + 1}:</strong><br>
              <small class="text-muted">
                Lat: ${point.lat.toFixed(4)}<br>
                Lng: ${point.lng.toFixed(4)}
              </small>
            </div>
          `;

          marker.bindPopup(basicPopupContent);
          this.markerClusterGroup?.addLayer(marker);
          this.markers.push(marker);

          // Try to get address with timeout
          try {
            const addressPromise = this.geocodingService.getAddress(point.lat, point.lng).toPromise();
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Address lookup timeout')), 5000)
            );

            const address = await Promise.race([addressPromise, timeoutPromise]) as string;

            // Update popup with address if successful
            if (address && typeof address === 'string') {
              marker.setPopupContent(`
                <div style="min-width: 200px;">
                  <strong>Location ${index + 1}:</strong><br>
                  ${address}<br><br>
                  <small class="text-muted">
                    Lat: ${point.lat.toFixed(4)}<br>
                    Lng: ${point.lng.toFixed(4)}
                  </small>
                </div>
              `);

              marker.bindTooltip(address);
            }
          } catch (addressError) {
            console.warn(`Failed to get address for point ${index}:`, addressError);
            // Keep the basic popup content - no need to update
          }
        } catch (markerError) {
          console.error(`Error processing marker ${index}:`, markerError);
        }
      });

      // Wait for all markers to be processed (or fail)
      await Promise.allSettled(markerPromises);

      console.log(`Finished processing ${this.markers.length} markers`);

      // Clear timeout and set loading to false
      clearTimeout(loadingTimeout);
      this.isLoading = false;

    } catch (error) {
      console.error('Critical error in loadMarkers:', error);
      // Ensure loading is always set to false, even on critical errors
      this.isLoading = false;
    }
  }
}
