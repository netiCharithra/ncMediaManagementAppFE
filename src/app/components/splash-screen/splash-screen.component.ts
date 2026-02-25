import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit, OnDestroy {
  showSplash = true;
  private animationDuration = 500; // milliseconds
  private minimumDisplayTime = 2000; // Minimum display time in milliseconds

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    // Hide splash screen after minimum display time
    setTimeout(() => {
      this.hideSplash();
    }, this.minimumDisplayTime);
  }

  private hideSplash() {
    this.showSplash = false;

    // Remove from DOM after animation completes (browser only)
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        const splashElement = document.querySelector('app-splash-screen');
        if (splashElement) {
          splashElement.remove();
        }
      }
    }, this.animationDuration);
  }

  ngOnDestroy() {
    // Clean up any subscriptions if needed
  }
}
