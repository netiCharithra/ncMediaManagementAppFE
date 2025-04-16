import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DataStore } from '../../store/data.store';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isExpanded = false;
  isMobile = window.innerWidth <= 768;
  userData$: Observable<any>;

  constructor(
    private authService: AuthService,
    private dataStore: DataStore,
    private router: Router
  ) {
    this.userData$ = this.dataStore.userData$;
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    // Auto collapse when switching to mobile
    if (!wasMobile && this.isMobile && this.isExpanded) {
      this.isExpanded = false;
    }
  }

  toggleMenu(): void {
    this.isExpanded = !this.isExpanded;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
