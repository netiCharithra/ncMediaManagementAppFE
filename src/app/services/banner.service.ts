import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BannerService {
    private bannerVisible = new BehaviorSubject<boolean>(false);
    bannerVisible$ = this.bannerVisible.asObservable();

    setBannerVisibility(visible: boolean): void {
        this.bannerVisible.next(visible);
        if (visible) {
            document.body.classList.add('app-banner-visible');
        } else {
            document.body.classList.remove('app-banner-visible');
        }
    }
}
