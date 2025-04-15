import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly USER_KEY = 'nc_auth_user';
  private readonly TOKEN_KEY = 'nc_auth_token';
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  setUser(user: User): void {
    // Store user details
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    if (user.token) {
      localStorage.setItem(this.TOKEN_KEY, user.token);
    }
    this.currentUserSubject.next(user);
  }

  getStoredUser(): User | null {
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

  updateUserInfo(updates: Partial<User>): void {
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
