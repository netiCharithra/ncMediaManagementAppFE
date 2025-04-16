import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly USER_KEY = 'nc_auth_user';
  private readonly TOKEN_KEY = 'nc_auth_token';
  
  private currentUserSubject: BehaviorSubject<any | null>;
  public currentUser: Observable<any | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<any | null>(this.getStoredUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any | null {
    return this.currentUserSubject.value;
  }

  setUser(user: any): void {
    // Store user details
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    if (user.token) {
      localStorage.setItem(this.TOKEN_KEY, user.token);
    }
    this.currentUserSubject.next(user);
  }

  getStoredUser() {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        this.clearStorage();
      }
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserValue;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  isEditor(): boolean {
    return this.currentUserValue?.role === 'editor';
  }

  updateUserInfo(updates: Partial<any>): void {
    const currentUser = this.getStoredUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this.setUser(updatedUser);
    }
  }

  clearStorage(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  logout(): void {
    this.clearStorage();
  }
}
