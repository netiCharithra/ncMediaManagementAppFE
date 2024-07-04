import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  private storageSub = new Subject<String>();
  constructor() {
    localStorage.getItem('token');
    sessionStorage.getItem('token');
  }
  private _getLocal(key: any) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;

  }
  private _getLocalValue(key: any) {
    return localStorage.getItem(key);
  }
  private _saveLocal(key: any, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  private _saveLocalValue(key: any, value: any) {
    return localStorage.setItem(key, value);
  }
  private _removeLocal(key: any) {
    return localStorage.removeItem(key);
  }
  private _clearLocal() {
    return localStorage.clear();
  }
  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }
  private _getSession(key: any) {
    let data: any;
    try {
      const item = sessionStorage.getItem(key);

      return item ? JSON.parse(item) : null;

    } catch (e) {
      data = sessionStorage.getItem(key);
    }
    return data;
  }
  private _saveSession(key: any, value: any) {
    return sessionStorage.setItem(key, JSON.stringify(value));
  }
  private _removeSession(key: any) {
    return sessionStorage.removeItem(key);
  }
  private _clearSession() {
    return sessionStorage.clear();
  }
  public api = {
    local: {
      get: this._getLocal,
      getValue: this._getLocalValue,
      save: this._saveLocal,
      saveValue: this._saveLocalValue,
      remove: this._removeLocal,
      clear: this._clearLocal
    },
    session: {
      get: this._getSession,
      save: this._saveSession,
      remove: this._removeSession,
      clear: this._clearSession
    }
  }
}
