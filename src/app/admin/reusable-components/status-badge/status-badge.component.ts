import { Component, Input } from '@angular/core';

export type BadgeStatus = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'primary';

@Component({
    selector: 'app-status-badge',
    templateUrl: './status-badge.component.html',
    styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
    /** Semantic status colour */
    @Input() status: BadgeStatus = 'neutral';

    /** Optional icon class (e.g. "fas fa-check") */
    @Input() icon: string = '';

    /** The badge label text */
    @Input() label: string = '';

    /** Show animated pulsing dot (for live/active states) */
    @Input() pulse: boolean = false;
}
