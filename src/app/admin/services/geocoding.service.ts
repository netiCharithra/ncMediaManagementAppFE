import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) {}

  getAddress(lat: number, lng: number): Observable<string> {
    const params = {
      format: 'json',
      lat: lat.toString(),
      lon: lng.toString(),
      'accept-language': 'en',
      zoom: 18,
      addressdetails: '1'
    };

    return this.http.get(this.NOMINATIM_URL, { params }).pipe(
      map((response: any) => {
        if (!response) return 'Address not found';
        
        // Try to get a human-readable address
        const address = response.address;
        if (address) {
          return [
            address.road,
            address.neighbourhood,
            address.suburb,
            address.city,
            address.state,
            address.country,
            address.postcode
          ].filter(Boolean).join(', ');
        }
        return response.display_name || 'Address not available';
      })
    );
  }
}
