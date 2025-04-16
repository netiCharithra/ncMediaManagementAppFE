import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';
import { StorageService } from './storage.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService,
    private storageService: StorageService
  ) {
    // // const storedUser = this.storageService.getItem('currentUser');
    // if (storedUser) {
    //   this.currentUserSubject.next(JSON.parse(storedUser));
    // }
  }

  login(email: string, password: string): Observable<User> {
    const encryptedPassword = this.encryptionService.encrypt(password);
    return this.http.post<{data: User}>(`${this.apiUrl}/login`, { 
      email, 
      password: encryptedPassword 
    }).pipe(
      map(response => {
        if (response?.data) {
          const user: User = {
            id: response.data.id,
            name: response.data.name || email.split('@')[0], // Fallback name if not provided
            email: response.data.email,
            role: response.data.role
          };
          // this.storageService.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  logout(): void {
    // this.storageService.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === role : false;
  }
}
