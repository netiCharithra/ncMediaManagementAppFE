import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataStore {
  private readonly _userData = new BehaviorSubject<UserInfo | null>(null);
  readonly userData$ = this._userData.asObservable();

  constructor() {}

  // Store user data after login
  setUserData(user: UserInfo) {
    this._userData.next(user);
  }

  // Get user data when needed
  getUserData(): UserInfo | null {
    return this._userData.value;
  }

  // Update specific user data fields
  updateUserData(updates: Partial<UserInfo>) {
    const currentData = this._userData.value;
    if (currentData) {
      this._userData.next({ ...currentData, ...updates });
    }
  }

  // Clear on logout
  clearUserData() {
    this._userData.next(null);
  }
}
