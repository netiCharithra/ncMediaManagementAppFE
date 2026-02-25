import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly USER_KEY = 'nc_auth_user';
  private readonly TOKEN_KEY = 'nc_auth_token';

  private readonly isBrowser: boolean;

  private currentUserSubject: BehaviorSubject<any | null>;
  public currentUser: Observable<any | null>;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    // On the server, localStorage doesn't exist – initialise with null.
    this.currentUserSubject = new BehaviorSubject<any | null>(this.getStoredUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any | null {
    return this.currentUserSubject.value;
  }

  setUser(user: any): void {
    if (this.isBrowser) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      if (user.token) {
        localStorage.setItem(this.TOKEN_KEY, user.token);
      }
    }
    this.currentUserSubject.next(user);
  }

  getStoredUser(): any | null {
    if (!this.isBrowser) return null;
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
    if (!this.isBrowser) return null;
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
    if (this.isBrowser) {
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.currentUserSubject.next(null);
  }

  logout(): void {
    this.clearStorage();
  }
}
