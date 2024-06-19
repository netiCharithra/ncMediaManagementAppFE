import { Injectable } from '@angular/core';
import { AppServiceService } from './app-service.service';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionalityService {

  constructor(private appService: AppServiceService) { }

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
}
