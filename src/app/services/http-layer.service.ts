// tslint:disable:component-selector import-blacklist no-parameter-reassignment forin member-ordering variable-name no-string-literal typedef ter-indent ter-arrow-parens align max-line-length no-this-assignment prefer-template no-increment-decrement no-inferrable-types

import { HttpClient, HttpHeaders, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
// import { ServiceloaderService } from '../components/loader/serviceloader/serviceloader.service';
// import { ToastrService } from '../components/toastr/toastr.service';
// import { gzip } from 'pako';
import { finalize, timeout, catchError, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpLayerService {
  public httpOptions = {
    headers: new HttpHeaders({
      Accept: '*/*',
      'Content-Type': 'application/json',
    }),
  };
  constructor(private _http: HttpClient, private storage:StorageService) { }

  post(url: string, data: any, values?: any, formData?:any): Observable<any> {
    try {
      const userDetails = this.storage.api.session.get('userData');
      // data['project_type'] = data.project_type || projectDetails['project_type'];
      // data['tz'] = data.tz || ((projectDetails && projectDetails.tz) ? projectDetails.tz : this.browserTz);
      // data['project_id'] = this.getProjectId(data);
      // data['language'] = localStorage.getItem('lang') || 'en';
      let payloadData = data;
      if(userDetails){
        payloadData = { ...userDetails, ...payloadData }
      }
      const contentType = this.detectContentType('POST', url, data);
      // return this._http.post(url, data)
      return this._http.post(url, formData ? formData : payloadData, contentType === 'application/json' ? this.httpOptions : values)
        .pipe(catchError((error) => {
          return throwError(error);
        }))
        .pipe(timeout(480000))
    } catch (error) {
      console.error(error);
    }
  }
  detectContentType(method, url, data) {
    const req = new HttpRequest(method, url, data);
    const contentType = req.detectContentTypeHeader();
    return contentType;
  }
}
