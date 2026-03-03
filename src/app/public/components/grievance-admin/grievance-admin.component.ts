import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PublicService } from '../../services/public.service';
import {
    GrievanceSummary,
    GrievanceDetail,
    GrievancePagination,
    GrievanceStatus,
    GrievanceListRequest,
    TERMINAL_STATUSES,
    ALL_STATUSES,
} from '../../interfaces/grievance-admin.interface';

@Component({
    selector: 'app-grievance-admin',
    templateUrl: './grievance-admin.component.html',
    styleUrls: ['./grievance-admin.component.scss'],
    providers: [DatePipe],
})
export class GrievanceAdminComponent implements OnInit, OnDestroy {

    // ─── Auth State ──────────────────────────────────────────────────────────────
    isAuthenticated = false;
    officerName: string | null = null;

    authStep: 'IDENTIFIER' | 'OTP' = 'IDENTIFIER';
    identifierForm!: FormGroup;
    otpForm!: FormGroup;

    isSendOtpLoading = false;
    sendOtpError: string | null = null;

    isVerifyOtpLoading = false;
    verifyOtpError: string | null = null;

    otpTimer = 0;
    private timerInterval: any;
    identifierSent: string = '';


    // ─── List State ─────────────────────────────────────────────────────────────
    grievances: GrievanceSummary[] = [];
    pagination: GrievancePagination = { totalRecords: 0, currentPage: 1, totalPages: 1, limit: 10 };
    isListLoading = false;
    listError: string | null = null;

    // ─── Filter Form ─────────────────────────────────────────────────────────────
    filterForm!: FormGroup;
    readonly ALL_STATUSES = ALL_STATUSES;

    // ─── Detail / Drawer State ───────────────────────────────────────────────────
    selectedGrievance: GrievanceDetail | null = null;
    isDetailLoading = false;
    isDrawerOpen = false;
    detailError: string | null = null;

    // ─── Action Form ─────────────────────────────────────────────────────────────
    actionForm!: FormGroup;
    readonly ALL_STATUSES_ACTION = ALL_STATUSES;
    isSubmitting = false;
    actionSuccess = false;
    actionError: string | null = null;

    // ─── Misc ────────────────────────────────────────────────────────────────────
    private destroy$ = new Subject<void>();
    readonly TERMINAL_STATUSES = TERMINAL_STATUSES;

    // ─── Status Config ───────────────────────────────────────────────────────────
    readonly statusConfig: Record<GrievanceStatus, { label: string; color: string; icon: string }> = {
        SUBMITTED: { label: 'Submitted', color: '#1976D2', icon: 'fa-paper-plane' },
        UNDER_REVIEW: { label: 'Under Review', color: '#F57C00', icon: 'fa-eye' },
        UNDER_INVESTIGATION: { label: 'Under Investigation', color: '#7B1FA2', icon: 'fa-magnifying-glass' },
        RESOLVED: { label: 'Resolved', color: '#2E7D32', icon: 'fa-circle-check' },
        REJECTED: { label: 'Rejected', color: '#C62828', icon: 'fa-circle-xmark' },
        ESCALATED: { label: 'Escalated', color: '#E65100', icon: 'fa-arrow-up-right-dots' },
        CLOSED: { label: 'Closed', color: '#546E7A', icon: 'fa-lock' },
    };

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

    constructor(
        private fb: FormBuilder,
        private publicService: PublicService,
        private datePipe: DatePipe,
        @Inject(PLATFORM_ID) private platformId: object,
    ) { }

    ngOnInit(): void {
        this.buildAuthForms();
        this.buildFilterForm();
        this.buildActionForm();

        // Restore session from localStorage (browser-only)
        if (isPlatformBrowser(this.platformId)) {
            const employeeId = localStorage.getItem('officer_id');
            if (employeeId) {
                this.isAuthenticated = true;
                this.officerName = localStorage.getItem('officer_name') || employeeId;
                this.initDashboard();
            }
        }
    }

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId)) {
            document.body.classList.remove('drawer-open');
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    // ─── Auth ────────────────────────────────────────────────────────────────────

    private buildAuthForms(): void {
        this.identifierForm = this.fb.group({
            identifier: ['', [Validators.required]],
        });

        this.otpForm = this.fb.group({
            otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        });
    }

    sendOtp(): void {
        this.identifierForm.markAllAsTouched();
        if (this.identifierForm.invalid) return;

        this.isSendOtpLoading = true;
        this.sendOtpError = null;

        const payload = this.identifierForm.value;

        this.publicService.requestOfficerOtp(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.isSendOtpLoading = false;

                    // If HttpService unwrapped the response, 'res' is the 'data' object.
                    // So 'status' might be undefined, but 'identifier' or 'expiresIn' will exist.
                    const isSuccess = res?.status === 'success' || res?.identifier || res?.data?.identifier || res?.expiresIn;

                    if (isSuccess && res?.status !== 'failed') {
                        const data = res?.data || res;
                        this.identifierSent = data?.identifier || payload.identifier;
                        const expiresIn = data?.expiresIn || 120;
                        this.authStep = 'OTP';
                        this.startOtpTimer(expiresIn);
                    } else {
                        this.sendOtpError = res?.message || res?.data?.message || 'Failed to send OTP.';
                    }
                },
                error: (err: any) => {
                    this.isSendOtpLoading = false;
                    this.sendOtpError = err?.error?.message || err?.message || 'Invalid user or server error. Please try again.';
                },
            });
    }

    verifyOtp(): void {
        this.otpForm.markAllAsTouched();
        if (this.otpForm.invalid) return;

        this.isVerifyOtpLoading = true;
        this.verifyOtpError = null;

        const payload = {
            identifier: this.identifierSent,
            otp: this.otpForm.value.otp
        };

        this.publicService.verifyOfficerOtp(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.isVerifyOtpLoading = false;

                    const isSuccess = res?.status === 'success' || res?.data?.userData || res?.userData || res?.employeeId;

                    if (isSuccess && res?.status !== 'failed') {
                        const userData = res?.data?.userData || res?.userData || res;
                        const id = userData?.employeeId || userData?.id || payload.identifier;
                        const name = userData?.name || id;

                        if (isPlatformBrowser(this.platformId)) {
                            localStorage.setItem('officer_id', id);
                            localStorage.setItem('officer_name', name);
                        }
                        this.officerName = name;
                        this.isAuthenticated = true;

                        this.stopOtpTimer();
                        this.initDashboard();
                    } else {
                        this.verifyOtpError = res?.message || res?.data?.message || 'Invalid OTP.';
                    }
                },
                error: (err: any) => {
                    this.isVerifyOtpLoading = false;
                    this.verifyOtpError = err?.error?.message || err?.message || 'Verification failed. Please try again.';
                },
            });
    }

    resendOtp(): void {
        if (this.otpTimer > 0) return;

        this.otpForm.reset();
        this.sendOtp();
    }

    startOtpTimer(seconds: number): void {
        this.stopOtpTimer();
        this.otpTimer = seconds;
        this.timerInterval = setInterval(() => {
            if (this.otpTimer > 0) {
                this.otpTimer--;
            } else {
                this.stopOtpTimer();
            }
        }, 1000);
    }

    stopOtpTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    get formattedOtpTimer(): string {
        const m = Math.floor(this.otpTimer / 60).toString().padStart(2, '0');
        const s = (this.otpTimer % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('officer_id');
            localStorage.removeItem('officer_name');
        }
        this.isAuthenticated = false;
        this.officerName = null;
        this.grievances = [];
        this.stopOtpTimer();
        this.authStep = 'IDENTIFIER';
        if (this.identifierForm) this.identifierForm.reset();
        if (this.otpForm) this.otpForm.reset();
        this.closeDrawer();
    }



    private initDashboard(): void {
        this.loadGrievances();
        this.filterForm.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            takeUntil(this.destroy$),
        ).subscribe(() => {
            this.pagination.currentPage = 1;
            this.loadGrievances();
        });
    }

    // ─── Filter Form ─────────────────────────────────────────────────────────────

    private buildFilterForm(): void {
        this.filterForm = this.fb.group({ status: [''], email: [''], ticketId: [''], employeeId: [''] });
    }

    clearFilters(): void {
        this.filterForm.reset({ status: '', email: '', ticketId: '', employeeId: '' });
    }

    // ─── Action Form ─────────────────────────────────────────────────────────────

    private buildActionForm(): void {
        this.actionForm = this.fb.group({
            newStatus: [null, Validators.required],
            actionTaken: ['', [Validators.required, Validators.minLength(5)]],
            remarks: ['', [Validators.required, Validators.minLength(5)]],
        });
    }

    get isFormLocked(): boolean {
        return !!this.selectedGrievance && TERMINAL_STATUSES.includes(this.selectedGrievance.status);
    }

    isFieldInvalid(field: string): boolean {
        const ctrl = this.actionForm.get(field);
        return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    // ─── List API ────────────────────────────────────────────────────────────────

    loadGrievances(): void {
        const { status, email, ticketId, employeeId } = this.filterForm.value;
        const params: GrievanceListRequest = {
            employeeId,
            page: this.pagination.currentPage,
            limit: this.pagination.limit,
            status, email, ticketId,
        };

        this.isListLoading = true;
        this.listError = null;

        this.publicService.listGrievances(params).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
                this.isListLoading = false;
                this.grievances = res?.grievances ?? [];
                this.pagination = res?.pagination ?? this.pagination;
            },
            error: () => {
                this.isListLoading = false;
                this.listError = 'Failed to load complaints. Please try again.';
            },
        });
    }

    goToPage(page: number): void {
        if (page < 1 || page > this.pagination.totalPages) return;
        this.pagination.currentPage = page;
        this.loadGrievances();
    }

    get pageNumbers(): number[] {
        const total = this.pagination.totalPages;
        const current = this.pagination.currentPage;
        const start = Math.max(1, current - 2);
        const end = Math.min(total, current + 2);
        const pages: number[] = [];
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }

    // ─── Detail / Drawer ─────────────────────────────────────────────────────────

    private scrollPosition = 0;

    openDetail(ticketId: string): void {
        if (isPlatformBrowser(this.platformId)) {
            this.scrollPosition = window.pageYOffset;
            document.body.classList.add('drawer-open');
            document.body.style.top = `-${this.scrollPosition}px`;
        }
        this.isDrawerOpen = true;

        this.selectedGrievance = null;
        this.isDetailLoading = true;
        this.detailError = null;
        this.actionSuccess = false;
        this.actionError = null;
        this.actionForm.reset();

        this.publicService.getGrievanceDetail(ticketId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (detail) => {
                this.isDetailLoading = false;
                this.selectedGrievance = detail;
                if (this.isFormLocked) {
                    this.actionForm.disable();
                } else {
                    this.actionForm.enable();
                }
            },
            error: () => {
                this.isDetailLoading = false;
                this.detailError = 'Could not load complaint details.';
            },
        });
    }

    closeDrawer(): void {
        this.isDrawerOpen = false;
        if (isPlatformBrowser(this.platformId)) {
            document.body.classList.remove('drawer-open');
            document.body.style.top = '';
            window.scrollTo(0, this.scrollPosition);
        }
        this.selectedGrievance = null;
    }

    // ─── Action Submit ───────────────────────────────────────────────────────────

    submitAction(): void {
        this.actionForm.markAllAsTouched();
        if (this.actionForm.invalid || !this.selectedGrievance || this.isFormLocked) return;

        this.isSubmitting = true;
        this.actionError = null;
        this.actionSuccess = false;

        const officerId = isPlatformBrowser(this.platformId) ? (localStorage.getItem('officer_id') || undefined) : undefined;
        const officerName = this.officerName || (isPlatformBrowser(this.platformId) ? (localStorage.getItem('officer_name') || undefined) : undefined);

        const payload = {
            ...this.actionForm.value,
            officerId,
            officerName,
        };

        this.publicService.patchGrievanceAction(
            this.selectedGrievance.ticketId,
            payload,
        ).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.actionSuccess = true;
                this.openDetail(this.selectedGrievance!.ticketId);
                this.loadGrievances();
            },
            error: (err: any) => {
                this.isSubmitting = false;
                this.actionError = err?.message ?? 'Failed to update. Try again.';
            },
        });
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────────

    formatDate(epoch: number): string {
        return this.datePipe.transform(epoch, 'dd MMM yyyy, h:mm a') ?? '—';
    }

    getStatusCfg(status: GrievanceStatus) {
        return this.statusConfig[status] ?? this.statusConfig['SUBMITTED'];
    }

    getCategoryLabel(cat: string): string {
        return this.categoryLabels[cat] ?? cat;
    }

    isImageFile(url: string): boolean {
        return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
    }

    getFileName(url: string): string {
        try {
            const parts = new URL(url).pathname.split('/');
            return decodeURIComponent(parts[parts.length - 1]);
        } catch {
            return url;
        }
    }
}
