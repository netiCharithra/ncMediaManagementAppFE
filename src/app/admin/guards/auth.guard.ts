import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataStore } from '../store/data.store';
import { StorageService } from '../services/storage.service';
import { MessageService } from '../services/message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private messageService: MessageService
  ) {}

  private isSessionExpired(expiryTime: number): boolean {
    const currentTime = Date.now();
    return currentTime > expiryTime;
  }

  private handleSessionExpired() {
    this.messageService.showError('Your session has expired. Please login again.');
    this.authService.logout();
    this.router.navigate(['/admin/login']);
    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userData = this.storageService.getStoredUser();
    console.log("UserData", userData);

    if (userData?.employeeId) {
      // Check if session is expired
      if (userData.expiryTime && this.isSessionExpired(userData.expiryTime)) {
        return this.handleSessionExpired();
      }

      // User is logged in and session is valid
      if (state.url === '/admin/login') {
        // If trying to access login page while logged in, redirect to dashboard
        this.router.navigate(['/admin/dashboard']);
        return false;
      }
      return true;
    }

    // Not logged in
    if (state.url !== '/admin/login') {
      // If trying to access protected route while not logged in, redirect to login
      this.messageService.showInfo('Please login to continue.');
      this.router.navigate(['/admin/login']);
      return false;
    }

    // Allow access to login page when not logged in
    return true;
  }
}
