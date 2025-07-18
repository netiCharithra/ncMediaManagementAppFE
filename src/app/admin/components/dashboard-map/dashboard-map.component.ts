import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
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

  constructor(private geocodingService: GeocodingService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visitorLocations'] && changes['visitorLocations'].currentValue) {
      this.rawCoordinates = this.visitorLocations || [];
      if (this.rawCoordinates.length > 0) {
        this.initMap();
        // Ensure map is fully initialized before loading markers
        setTimeout(() => this.loadMarkers(), 0);
      } else {
        this.isLoading = false;
      }
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([20.5937, 78.9629], 4.3); // Center on India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.markerClusterGroup = L.markerClusterGroup();
    this.map?.addLayer(this.markerClusterGroup);
  }

  private async loadMarkers(): Promise<void> {
    if (!this.rawCoordinates || this.rawCoordinates.length === 0) {
      this.isLoading = false;
      return;
    }

    // Define a custom icon
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Clear any existing markers
    this.markerClusterGroup?.clearLayers();
    this.markers = [];
    
    // Process raw coordinates
    for (const point of this.rawCoordinates) {
      const marker = L.marker([point.lat, point.lng], {
        title: 'Loading address...',
        icon: defaultIcon
      });

      // Initial popup with loading message
      const popupContent = `
        <div style="min-width: 200px;">
          <div class="text-center">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 mb-0">Loading address...</p>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent).openPopup();
      this.markerClusterGroup?.addLayer(marker);
      this.markers.push(marker);

      try {
        // Get address for the coordinates
        const address = await this.geocodingService.getAddress(point.lat, point.lng).toPromise();
        
        // Update popup with address
        marker.setPopupContent(`
          <div style="min-width: 200px;">
            <strong>Location:</strong><br>
            ${address}<br><br>
            <small class="text-muted">
              Lat: ${point.lat.toFixed(4)}<br>
              Lng: ${point.lng.toFixed(4)}
            </small>
          </div>
        `);
        
        // Update marker title for better accessibility
        if (address) {
          marker.bindTooltip(address);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        marker.setPopupContent(`
          <div style="min-width: 200px;">
            <strong>Location:</strong><br>
            Address not available<br><br>
            <small class="text-muted">
              Lat: ${point.lat.toFixed(4)}<br>
              Lng: ${point.lng.toFixed(4)}
            </small>
          </div>
        `);
      }
    }
    
    this.isLoading = false;
  }
}
