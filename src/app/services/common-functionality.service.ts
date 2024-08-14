import { Injectable } from '@angular/core';
import { AppServiceService } from './app-service.service';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionalityService {

  // public show
  constructor(private appService: AppServiceService, private storage: StorageService, private router: Router, private http: HttpClient) { }

  encodingURI(str:any) {
    const utf8Bytes = new TextEncoder().encode(str);
    let binaryString = '';
    for (let byte of utf8Bytes) {
      binaryString += String.fromCharCode(byte);
    }
    return window.btoa(binaryString);
  }

  decodingURI(str:any) {
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
  private sidebarTriggerSubject = new Subject<void>();
  sidebarTriggered$ = this.sidebarTriggerSubject.asObservable();

  // Method to trigger sidebar from header
  triggerSidebarFromHeader() {
    this.sidebarTriggerSubject.next();
  }

  getYearRangeReverse(startYear:number) {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let year = currentYear; year >= startYear; year--) {
        years.push(year);
    }
    
    return years;
}



 getMonthEpochs(year: number) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const months: { month: string, startEpoch: number, endEpoch: number }[] = [];
  
  const endMonth = (year === currentYear) ? currentMonth : 11;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  for (let month = 0; month <= endMonth; month++) {
      const startDate = new Date(year, month, 1, 0, 0, 0);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const startEpoch = Math.floor(startDate.getTime() / 1000);
      const endEpoch = Math.floor(endDate.getTime() / 1000);

      months.push({
          month: monthNames[month], // Month name
          startEpoch,
          endEpoch
      });
  }

  return months;
}

}
