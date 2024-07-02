import { Injectable } from '@angular/core';
import { AppServiceService } from './app-service.service';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionalityService {

  constructor(private appService: AppServiceService, private storage: StorageService, private router: Router, private http: HttpClient) { }

  encodingURI(str) {
    const utf8Bytes = new TextEncoder().encode(str);
    let binaryString = '';
    for (let byte of utf8Bytes) {
      binaryString += String.fromCharCode(byte);
    }
    return window.btoa(binaryString);
  }

  decodingURI(str) {
    const binaryString = window.atob(str);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }

  onNewsClick = async (newsInfo: any) => {
    try {

      let lang = await this.storage.api.local.getValue('userLanguage')

      this.router.navigate(['/view-news', lang || 'te', newsInfo['newsId'], this.encodingURI(JSON.stringify(newsInfo))]);

    } catch (error) {
      console.error(error)
    }
  }

  checkImage(url: string): Observable<boolean> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((blob: Blob) => blob.type.startsWith('image')),
      catchError(() => of(false))
    );
  }
  isMobile(): boolean {
    return window.innerWidth <= 768; // You can adjust the width threshold as needed
  }

  getCurrentLanguage = async () => {
    let lang = await this.storage.api.local.getValue('userLanguage')


    return lang
  }
}
