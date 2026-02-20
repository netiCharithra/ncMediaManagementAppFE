import { Component, OnInit, Input } from '@angular/core';
import { BannerService } from '../../../services/banner.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-smart-app-banner',
    templateUrl: './smart-app-banner.component.html',
    styleUrls: ['./smart-app-banner.component.scss']
})
export class SmartAppBannerComponent implements OnInit {
    @Input() newsId: string | null = null;
    @Input() language: string | null = null;

    isVisible = false;
    isDevMode = !environment.production;
    platform: 'android' | 'ios' = 'android';

    // Platform Specifics
    appTitle = 'Neti Charithra App';
    appSubtitle = 'Get it on Google Play';
    appId = 'com.ncmediauserapp'; // For Android Package or iOS App ID

    private readonly STORAGE_KEY = 'nc_app_banner_dismissed';
    private readonly DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    constructor(private bannerService: BannerService) { }

    ngOnInit(): void {
        this.checkVisibility();
    }

    checkVisibility(): void {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isWebView = this.isWebView();
        const isDismissed = this.isRecentlyDismissed();

        if (isIOS) {
            this.platform = 'ios';
            this.appTitle = 'Neti Charithra iOS App';
            this.appSubtitle = 'Get it on App Store';
            this.appId = '6443685250'; // TODO: Replace with actual App Store ID
        } else {
            this.platform = 'android';
            this.appTitle = 'Neti Charithra Android App';
            this.appSubtitle = 'Get it on Google Play';
            this.appId = 'com.ncmediauserapp';
        }

        // Show on Android/iOS, NOT in WebView, and if not dismissed in last 24h
        if (!environment.production || ((isAndroid || isIOS) && !isWebView && !isDismissed)) {
            // Small delay for smooth entry
            setTimeout(() => {
                this.isVisible = true;
                this.bannerService.setBannerVisibility(true);
            }, 1000);
        }
    }

    isWebView(): boolean {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        // Common markers for Android WebViews
        return /Version\/[\d\.]+.*Mobile/.test(userAgent) || /wv/.test(userAgent);
    }

    isRecentlyDismissed(): boolean {
        const dismissedAt = localStorage.getItem(this.STORAGE_KEY);
        if (!dismissedAt) return false;

        const lastDismissed = parseInt(dismissedAt, 10);
        const now = new Date().getTime();

        if (now - lastDismissed < this.DISMISS_DURATION) {
            return true;
        }

        // Clear expired dismissal
        localStorage.removeItem(this.STORAGE_KEY);
        return false;
    }

    dismiss(): void {
        this.isVisible = false;
        this.bannerService.setBannerVisibility(false);
        localStorage.setItem(this.STORAGE_KEY, new Date().getTime().toString());
    }

    openApp(): void {
        if (!this.newsId || !this.language) return;

        const path = `neticharithra.com/news/${this.language}/${this.newsId}`;

        if (this.platform === 'android') {
            const fallbackUrl = `https://play.google.com/store/apps/details?id=${this.appId}`;
            const intentUrl = `intent://${path}#Intent;scheme=https;package=${this.appId};S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end;`;
            window.location.href = intentUrl;
        } else {
            // iOS Deep Link Fallback logic
            const appUrl = `neticharithra://news/${this.language}/${this.newsId}`;
            const storeUrl = `https://apps.apple.com/app/id${this.appId}`;

            // Try opening app
            window.location.href = appUrl;

            // Fallback to store if not opened within 2 seconds
            setTimeout(() => {
                if (document.hasFocus()) {
                    window.location.href = storeUrl;
                }
            }, 2000);
        }

        this.dismiss();
    }
}
