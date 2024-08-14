import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, viewChildren } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CommonFunctionalityService } from '../../services/common-functionality.service';
import { ActivatedRoute, ChildActivationStart, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ParamMap, Router, Scroll } from '@angular/router';

@Component({
  selector: 'nc-web-manangement-screens-navbar',
  templateUrl: './manangement-screens-navbar.component.html',
  styleUrl: './manangement-screens-navbar.component.scss'
})
export class ManangementScreensNavbarComponent implements OnInit, AfterViewInit, OnDestroy {

  public activeRoute: any = '';

  mobileQuery: MediaQueryList;

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  fillerContent = Array.from(
    { length: 50 },
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  );

  private _mobileQueryListener: () => void;

  private subscription: Subscription;


  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public commonFunction: CommonFunctionalityService, private router: Router, private route: ActivatedRoute) {
    this.mobileQuery = media.matchMedia('(max-width: 767.98px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.subscription = this.commonFunction.sidebarTriggered$.subscribe(() => {
      this.triggeredFromHeader();
    });

    if (this.mobileQuery.matches) {
      this.openDrawer = false
    }
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Navigation is starting
        console.log('Route change detected');
      }
      else if (event instanceof NavigationEnd) {
        // Navigation End
        let url = event.urlAfterRedirects.split('/')

        console.log(url[2]);
        // this.activeRoute = url.at(-1);
        this.activeRoute = url.at(-1)?.split('?')[0]
        // console.log('Route parameters changed:', this.screenLoaded);
      }
      else if (event instanceof ChildActivationStart) {
        // ChildActivationStart router begins activating a route's children.
        console.log('ChildActivationStart --- ', event.toString());
      }
      else if (event instanceof NavigationCancel) {
        //When navigation is canceled.
        console.log('NavigationCancel --- ', event.url);
      }
      else if (event instanceof NavigationError) {
        // Error Show
        console.log(event.error);
      }
      else if (event instanceof Scroll) {
        // When the user scrolls.
        console.log('Scroll --- ', event.position);
      }
    });
  }
  // Function to be triggered from header
  triggeredFromHeader() {
    console.log('Sidebar function triggered from Header');
    this.onClickOfMenuBtn();
    // Add your sidebar functionality here
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.subscription.unsubscribe();

  }

  // shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
  shouldRun = true;

  @ViewChild('snav') snav!: MatSidenav;

  ngOnInit(): void {
    console.log(this.snav)
    console.log(this.mobileQuery?.matches)
  }

  // toggleDrawer() {
  //   this.drawer.toggle();
  // }
  ngAfterViewInit() {

  }

  public openDrawer: boolean = true;
  public showLabel: boolean = true;

  public showHideContent: boolean = true;


  showHideContentChange = () => {
    this.showHideContent = false;
    setTimeout(() => {
      this.showHideContent = true;
    }, 1);
  }


  onClickOfMenuBtn = () => {

    if (this.mobileQuery.matches) {
      this.openDrawer = !this.openDrawer;
      this.snav.toggle()
      this.showLabel = true;
    } else {
      if (!this.snav?.opened) {
        this.snav.toggle()

      }
      this.showLabel = !this.showLabel;
      this.showHideContentChange()
    }
    console.log(this.snav)
    // this.snav.toggle()
    console.log(this.snav)

  }

  closeInMobile = () => {

    if (this.mobileQuery.matches) {
      this.openDrawer = !this.openDrawer;
      // this.snav.toggle()
      // this.showLabel = true;
    } 
    // else {
    //   if (!this.snav?.opened) {
    //     this.snav.toggle()

    //   }
    //   this.showLabel = !this.showLabel;
    //   this.showHideContentChange()
    // }
    // console.log(this.snav)
    // // this.snav.toggle()
    // console.log(this.snav)

  }



  onSidenavStateChanged(opened: any) {
    console.log("CC")
    if (!opened) {
      // Do something when the sidenav is closed
      console.log('Sidenav closed');
      // You can trigger any action or set a flag here
    }
  }



  public menuList = [
    {
      "label": "Dashboard",
      "icon": 'speedometer',
      "routeKey": "dashboard"
    },
    {
      "label": "News Management",
      "icon": "newspaper",
      routeKey:"news-management"
    },
    {
      "label": "Employee Management",
      "icon": "people-fill",
      routeKey:"employee-management"

    },
    {
      "label": "Employee Tracing",
      "icon": "person-vcard",
      routeKey:"employee-tracing"

    }
  ]
}
