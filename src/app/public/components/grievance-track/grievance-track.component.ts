import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GrievanceThemeService } from '../../services/grievance-theme.service';
import { PublicService } from '../../services/public.service';
import {
    GrievanceTrackResponse,
    GrievanceTimelineEntry,
    GrievanceStatus,
} from '../../interfaces/grievance-track.interface';

@Component({
    selector: 'app-grievance-track',
    templateUrl: './grievance-track.component.html',
    styleUrls: ['./grievance-track.component.scss'],
    providers: [DatePipe],
})
export class GrievanceTrackComponent implements OnInit {
    // ─── Form ────────────────────────────────────────────────────────────────
    trackForm!: FormGroup;

    // ─── UI State ────────────────────────────────────────────────────────────
    isLoading = false;
    trackData: GrievanceTrackResponse | null = null;
    errorMessage: string | null = null;
    hasSearched = false;

    // ─── Status Config ───────────────────────────────────────────────────────
    readonly statusConfig: Record<
        GrievanceStatus,
        { label: string; color: string; icon: string; bgClass: string }
    > = {
            SUBMITTED: {
                label: 'Submitted',
                color: '#1976D2',
                icon: 'fa-paper-plane',
                bgClass: 'status-submitted',
            },
            UNDER_REVIEW: {
                label: 'Under Review',
                color: '#F57C00',
                icon: 'fa-search',
                bgClass: 'status-under-review',
            },
            UNDER_INVESTIGATION: {
                label: 'Under Investigation',
                color: '#7B1FA2',
                icon: 'fa-magnifying-glass',
                bgClass: 'status-investigation',
            },
            RESOLVED: {
                label: 'Resolved',
                color: '#2E7D32',
                icon: 'fa-circle-check',
                bgClass: 'status-resolved',
            },
            REJECTED: {
                label: 'Rejected',
                color: '#C62828',
                icon: 'fa-circle-xmark',
                bgClass: 'status-rejected',
            },
            ESCALATED: {
                label: 'Escalated',
                color: '#E65100',
                icon: 'fa-arrow-up-right-dots',
                bgClass: 'status-escalated',
            },
            CLOSED: {
                label: 'Closed',
                color: '#546E7A',
                icon: 'fa-lock',
                bgClass: 'status-closed',
            },
        };

    @HostBinding('class.dark-theme') get darkTheme() { return this.themeService.isDark; }

    constructor(
        private fb: FormBuilder,
        private publicService: PublicService,
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        public themeService: GrievanceThemeService
    ) { }

    toggleTheme(): void { this.themeService.toggle(); }

    ngOnInit(): void {
        this.buildForm();
        this.checkRouteParams();
    }

    private checkRouteParams(): void {
        const tid = this.route.snapshot.paramMap.get('ticketId');
        if (tid) {
            this.trackForm.patchValue({ ticketId: tid });
            this.onSearch();
        }
    }

    // ─── Form ────────────────────────────────────────────────────────────────

    private buildForm(): void {
        this.trackForm = this.fb.group({
            ticketId: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^NC-GR-\d{4}-\d{4}$/),
                ],
            ],
        });
    }

    get ticketIdCtrl() {
        return this.trackForm.get('ticketId')!;
    }

    isInvalid(field: string): boolean {
        const ctrl = this.trackForm.get(field);
        return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    // ─── Search ──────────────────────────────────────────────────────────────

    onSearch(): void {
        this.trackForm.markAllAsTouched();
        if (this.trackForm.invalid) return;

        const ticketId: string = this.ticketIdCtrl.value.trim().toUpperCase();

        this.isLoading = true;
        this.trackData = null;
        this.errorMessage = null;
        this.hasSearched = true;

        this.publicService.trackGrievance(ticketId).subscribe({
            next: (data: GrievanceTrackResponse | null) => {
                this.isLoading = false;
                if (data) {
                    this.trackData = data;
                } else {
                    this.errorMessage = 'not_found';
                }
            },
            error: (err: any) => {
                this.isLoading = false;
                const status = err?.status ?? 0;
                if (status === 404) {
                    this.errorMessage = 'not_found';
                } else {
                    this.errorMessage = 'server_error';
                }
            },
        });
    }

    onReset(): void {
        this.trackForm.reset();
        this.trackData = null;
        this.errorMessage = null;
        this.hasSearched = false;
    }

    // ─── Timeline helpers ────────────────────────────────────────────────────

    /**
     * Returns resolved timeline. If backend returns an empty array, inject a
     * synthetic "Successfully Submitted" first step.
     */
    get resolvedTimeline(): GrievanceTimelineEntry[] {
        if (!this.trackData) return [];
        if (this.trackData.timeline && this.trackData.timeline.length > 0) {
            return this.trackData.timeline;
        }
        // Empty – generate a virtual first step
        return [
            {
                status: 'SUBMITTED',
                actionTaken: 'Complaint successfully submitted. Awaiting review.',
                timestamp: this.trackData.submittedAt,
            },
        ];
    }

    isLastStep(index: number): boolean {
        return index === this.resolvedTimeline.length - 1;
    }

    // ─── Status helpers ──────────────────────────────────────────────────────

    getStatusConfig(status: GrievanceStatus) {
        return this.statusConfig[status] || this.statusConfig['SUBMITTED'];
    }

    // ─── Date helpers ────────────────────────────────────────────────────────

    formatEpoch(epoch: number): string {
        return this.datePipe.transform(epoch, 'dd MMM yyyy, h:mm a') || '—';
    }

    formatDate(epoch: number): string {
        return this.datePipe.transform(epoch, 'dd MMM yyyy') || '—';
    }

    // ─── Category label ──────────────────────────────────────────────────────

    readonly categoryLabels: Record<string, string> = {
        MISINFORMATION: 'Misinformation',
        PRIVACY_VIOLATION: 'Privacy Violation',
        DEFAMATION: 'Defamation',
        HATE_SPEECH: 'Hate Speech',
        COPYRIGHT_INFRINGEMENT: 'Copyright Infringement',
        HARASSMENT: 'Harassment',
        FAKE_NEWS: 'Fake News',
        OTHER: 'Other',
    };

    getCategoryLabel(cat: string): string {
        return this.categoryLabels[cat] || cat;
    }
}
