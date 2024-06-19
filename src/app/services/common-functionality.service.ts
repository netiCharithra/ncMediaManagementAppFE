import { Injectable } from '@angular/core';
import { AppServiceService } from './app-service.service';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionalityService {

  constructor(private appService: AppServiceService, private storage: StorageService, private router: Router) { }

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

      this.router.navigate(['/view-news', lang || 'te', newsInfo['newsId']]);

    } catch (error) {
      console.error(error)
    }
  }
}
