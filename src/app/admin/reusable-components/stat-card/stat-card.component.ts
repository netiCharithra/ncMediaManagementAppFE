import { Component, Input } from '@angular/core';

export type StatCardVariant = 'indigo' | 'cyan' | 'emerald' | 'rose' | 'amber';

@Component({
    selector: 'app-stat-card',
    templateUrl: './stat-card.component.html',
    styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
    /** Card colour theme */
    @Input() variant: StatCardVariant = 'indigo';

    /** FontAwesome icon class, e.g. "fas fa-newspaper" */
    @Input() icon: string = 'fas fa-chart-bar';

    /** Main headline number */
    @Input() value: string | number = '—';

    /** Label below the number */
    @Input() label: string = '';

    /** Percent change number (positive or negative) */
    @Input() percentChange: number | null = null;

    /** Supporting context text, defaults to "vs last month" */
    @Input() context: string = 'vs last month';

    get isPositive(): boolean {
        return this.percentChange !== null && this.percentChange >= 0;
    }
}
