import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'news-website';
  private subscription: any;


  constructor(private router:Router){
    
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.scrollToTop();
      });
  }

  scrollToTop(behavior: 'auto' | 'smooth' = 'auto') {
    // This will work regardless of where router-outlet is placed
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: behavior
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
