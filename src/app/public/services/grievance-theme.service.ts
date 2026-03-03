import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'gp_theme';

@Injectable({ providedIn: 'root' })
export class GrievanceThemeService {

    private _isDark = new BehaviorSubject<boolean>(false);
    readonly isDark$ = this._isDark.asObservable();

    constructor(@Inject(PLATFORM_ID) private platformId: object) {
        if (isPlatformBrowser(this.platformId)) {
            // Default is light; only go dark if the user explicitly chose it
            const saved = localStorage.getItem(STORAGE_KEY);
            this._isDark.next(saved === 'dark');
        }
    }

    get isDark(): boolean {
        return this._isDark.value;
    }

    toggle(): void {
        const next = !this._isDark.value;
        this._isDark.next(next);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
        }
    }
}
