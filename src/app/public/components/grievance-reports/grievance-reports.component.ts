import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PublicService } from '../../services/public.service';
import { GrievanceThemeService } from '../../services/grievance-theme.service';
import {
    GrievanceReportResponse,
    MonthlyComplianceTrend,
    GrievanceReportCategory
} from '../../interfaces/grievance-admin.interface';

@Component({
    selector: 'app-grievance-reports',
    templateUrl: './grievance-reports.component.html',
    styleUrls: ['./grievance-reports.component.scss'],
})
export class GrievanceReportsComponent implements OnInit, OnDestroy {

    report: GrievanceReportResponse | null = null;
    isLoading = false;
    error: string | null = null;
    selectedYear: number = new Date().getFullYear();

    readonly currentMonth: number = new Date().getMonth() + 1;
    readonly currentYear: number = new Date().getFullYear();

    readonly availableYears: number[] = (() => {
        const current = new Date().getFullYear();
        return Array.from({ length: 4 }, (_, i) => current - i);
    })();

    readonly MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    readonly CATEGORY_LABELS: Record<string, string> = {
        MISINFORMATION: 'Misinformation',
        PRIVACY_VIOLATION: 'Privacy Violation',
        DEFAMATION: 'Defamation',
        HATE_SPEECH: 'Hate Speech',
        COPYRIGHT_INFRINGEMENT: 'Copyright Infringement',
        HARASSMENT: 'Harassment',
        FAKE_NEWS: 'Fake News',
        OTHER: 'Other',
    };

    private destroy$ = new Subject<void>();

    @HostBinding('class.dark-theme') get darkTheme() { return this.themeService.isDark; }

    constructor(
        private publicService: PublicService,
        public themeService: GrievanceThemeService
    ) { }

    toggleTheme(): void { this.themeService.toggle(); }

    ngOnInit(): void {
        this.loadReports();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadReports(): void {
        this.isLoading = true;
        this.error = null;
        this.report = null;

        // Fetch data for the entire selected year
        const startOfYear = new Date(this.selectedYear, 0, 1).getTime();
        const endOfYear = new Date(this.selectedYear, 11, 31, 23, 59, 59, 999).getTime();

        this.publicService.getGrievanceReport(startOfYear, endOfYear)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.isLoading = false;
                    // Handle both success-wrapped and raw data
                    if (res?.status === 'success') {
                        this.report = res.data;
                    } else if (res && !res.status) {
                        this.report = res;
                    }

                    if (!this.report || (!this.report.overall && !this.report.monthlyTrend)) {
                        this.report = null; // show empty state
                    }
                },
                error: () => {
                    this.isLoading = false;
                    this.error = 'Failed to load compliance reports.';
                },
            });
    }

    changeYear(year: number): void {
        this.selectedYear = year;
        this.loadReports();
    }

    /** Helper to get trend for a specific month (1-indexed) or a default object */
    getTrendForMonth(month: number): MonthlyComplianceTrend {
        const found = this.report?.monthlyTrend?.find(m => m.month === month && m.year === this.selectedYear);
        return found || {
            month,
            year: this.selectedYear,
            total: 0,
            resolved: 0,
            rejected: 0,
            submitted: 0,
            underInvestigation: 0
        };
    }

    resolutionRate(resolved: number, rejected: number): number | null {
        const total = resolved + rejected;
        if (total === 0) return null;
        return Math.round((resolved / total) * 100);
    }

    rateColor(rate: number | null): string {
        if (rate === null) return '#9E9E9E';
        if (rate >= 70) return '#2E7D32';
        if (rate >= 40) return '#F57C00';
        return '#C62828';
    }

    getCategoryLabel(cat: string): string {
        return this.CATEGORY_LABELS[cat] || cat;
    }

    /**
     * Converts a resolution rate (0–100) to SVG stroke-dashoffset for the circular gauge.
     * The gauge circle has r=32, so circumference = 2 * π * 32 ≈ 201.06.
     */
    getGaugeDashOffset(rate: number | null): number {
        const circumference = 2 * Math.PI * 32; // ≈ 201.06
        if (rate === null) return circumference;
        return circumference - (rate / 100) * circumference;
    }

    /** Returns months to show: all 12 for past years, up to current month for current year */
    get displayedMonths(): number[] {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-indexed

        if (this.selectedYear < currentYear) {
            // All 12 months for past years
            return Array.from({ length: 12 }, (_, i) => i + 1);
        } else if (this.selectedYear === currentYear) {
            // Only up to today's month for current year
            return Array.from({ length: currentMonth }, (_, i) => i + 1);
        }
        return [];
    }
}
