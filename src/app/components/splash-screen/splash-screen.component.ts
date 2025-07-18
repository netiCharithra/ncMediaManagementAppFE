import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit, OnDestroy {
  showSplash = true;
  private animationDuration = 500; // milliseconds
  private minimumDisplayTime = 2000; // Minimum display time in milliseconds

  ngOnInit() {
    // Hide splash screen after minimum display time
    setTimeout(() => {
      this.hideSplash();
    }, this.minimumDisplayTime);
  }

  private hideSplash() {
    this.showSplash = false;
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      const splashElement = document.querySelector('app-splash-screen');
      if (splashElement) {
        splashElement.remove();
      }
    }, this.animationDuration);
  }

  ngOnDestroy() {
    // Clean up any subscriptions if needed
  }
}
