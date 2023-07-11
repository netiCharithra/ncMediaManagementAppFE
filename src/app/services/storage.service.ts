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
  private _getLocal(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  private _saveLocal(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  private _removeLocal(key) {
    return localStorage.removeItem(key);
  }
  private _clearLocal() {
    return localStorage.clear();
  }
  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }
  private _getSession(key) {
    let data: any;
    try {
      data = JSON.parse(sessionStorage.getItem(key));
    } catch (e) {
      data = sessionStorage.getItem(key);
    }
    return data;
  }
  private _saveSession(key, value) {
    return sessionStorage.setItem(key, JSON.stringify(value));
  }
  private _removeSession(key) {
    return sessionStorage.removeItem(key);
  }
  private _clearSession() {
    return sessionStorage.clear();
  }
  public api = {
    local: {
      get: this._getLocal,
      save: this._saveLocal,
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
