import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'app/services/storage.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  hidden?: boolean;
}
export const ROUTES: RouteInfo[] = [
  { path: '/app/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/app/news', title: 'News', icon: 'newspaper', class: '' },
  { path: '/app/employee-tracing', title: 'Employee Tracing', icon: 'newspaper', class: '' },
  { path: '/app/employees', title: 'Employees', icon: 'groups_3', class: '' },
  { path: '/app/employee-management', title: 'Employee Management', icon: 'badge', class: '' },
  { path: '/app/user-profile', title: 'User Profile', icon: 'person', class: '', hidden:true },
  // { path: '/app/table-list', title: 'Table List', icon: 'content_paste', class: '' },
  // { path: '/app/typography', title: 'Typography', icon: 'library_books', class: '' },
  // { path: '/app/icons', title: 'Icons', icon: 'bubble_chart', class: '' },
  // { path: '/app/maps', title: 'Maps', icon: 'location_on', class: '' },
  // { path: '/app/notifications', title: 'Notifications', icon: 'notifications', class: '' },
  { path: '/app/subscribers', title: 'Subscribers', icon: 'diversity_3', class: '' },
  { path: '/app/advertisementManagement', title: 'Advertisement Management', icon: 'diversity_3', class: '' },
  { path: 'logout', title: 'Logout', icon: 'logout', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  public userData: any = {};

  constructor(private router:Router, private storage:StorageService) { }

  ngOnInit() {
    this.userData = this.storage.api.session.get('userData');

    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  };

  navigating = (item) => {
    try {
      if (item.path === 'logout'){
        this.storage.api.session.remove('userData');
        this.router.navigate(['']);

      } else {

        this.router.navigate([item.path]);
      }

    } catch (error) {
      console.error(error)
    }
  }
  
}
