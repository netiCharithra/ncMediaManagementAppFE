import { Component, OnInit, HostBinding } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { GrievanceThemeService } from '../../services/grievance-theme.service';
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { PublicService } from '../../services/public.service';

// ─── Custom validator: URL must begin with http or https ───────────────────────
function urlValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    if (!value) return null; // let required handle empty
    try {
        const url = new URL(value);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return { invalidUrl: true };
        }
        return null;
    } catch {
        return { invalidUrl: true };
    }
}

@Component({
    selector: 'app-grievance',
    templateUrl: './grievance.component.html',
    styleUrls: ['./grievance.component.scss'],
})
export class GrievanceComponent implements OnInit {
    grievanceForm!: FormGroup;

    // UI state
    isSubmitting = false;
    submissionSuccess = false;
    serverError: string | null = null;
    referenceId = '';

    // File upload state
    selectedFiles: File[] = [];
    fileError: string | null = null;
    isDragOver = false;

    private readonly MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    private readonly MAX_FILES = 3;
    private readonly ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf'];

    @HostBinding('class.dark-theme') get darkTheme() { return this.themeService.isDark; }

    constructor(
        private fb: FormBuilder,
        private publicService: PublicService,
        private location: Location,
        private router: Router,
        public themeService: GrievanceThemeService
    ) { }

    toggleTheme(): void { this.themeService.toggle(); }

    ngOnInit(): void {
        this.buildForm();
    }

    // ─── Form ────────────────────────────────────────────────────────────────────

    private buildForm(): void {
        this.grievanceForm = this.fb.group({
            complainantName: ['', [Validators.required, Validators.minLength(2)]],
            complainantEmail: ['', [Validators.required, Validators.email]],
            complainantPhone: [''],
            grievanceCategory: ['', Validators.required],
            contentUrl: ['', [Validators.required, urlValidator]],
            description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
            declaration: [false, Validators.requiredTrue],
        });
    }

    /** Helper: returns true if a field is invalid AND has been touched */
    isInvalid(field: string): boolean {
        const ctrl = this.grievanceForm.get(field);
        return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    get description(): string {
        return this.grievanceForm.get('description')?.value || '';
    }

    // ─── File Upload ─────────────────────────────────────────────────────────────

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.processFiles(Array.from(input.files));
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.isDragOver = true;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        this.isDragOver = false;
        if (event.dataTransfer?.files) {
            this.processFiles(Array.from(event.dataTransfer.files));
        }
    }

    private processFiles(incoming: File[]): void {
        this.fileError = null;

        for (const file of incoming) {
            if (this.selectedFiles.length >= this.MAX_FILES) {
                this.fileError = `You can upload a maximum of ${this.MAX_FILES} files.`;
                break;
            }
            if (!this.ALLOWED_TYPES.includes(file.type)) {
                this.fileError = `"${file.name}" is not a supported file type. Use PNG, JPG, GIF, or PDF.`;
                continue;
            }
            if (file.size > this.MAX_FILE_SIZE_BYTES) {
                this.fileError = `"${file.name}" exceeds the 5 MB size limit.`;
                continue;
            }
            // Avoid duplicates
            if (!this.selectedFiles.find((f) => f.name === file.name && f.size === file.size)) {
                this.selectedFiles.push(file);
            }
        }
    }

    removeFile(index: number): void {
        this.selectedFiles.splice(index, 1);
        this.fileError = null;
    }

    getFileIcon(filename: string): string {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return 'fa-file-pdf';
        if (['png', 'jpg', 'jpeg', 'gif'].includes(ext || '')) return 'fa-file-image';
        return 'fa-file';
    }

    formatFileSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    // ─── Submission ──────────────────────────────────────────────────────────────

    onSubmit(): void {
        // Touch all fields to reveal validation errors
        this.grievanceForm.markAllAsTouched();
        if (this.grievanceForm.invalid) return;

        this.isSubmitting = true;
        this.serverError = null;

        // Build FormData for multipart upload
        const fd = new FormData();
        const formValue = this.grievanceForm.value;

        fd.append('complainantName', formValue.complainantName);
        fd.append('complainantEmail', formValue.complainantEmail);
        fd.append('complainantPhone', formValue.complainantPhone || '');
        fd.append('grievanceCategory', formValue.grievanceCategory);
        fd.append('contentUrl', formValue.contentUrl);
        fd.append('description', formValue.description);
        this.selectedFiles.forEach((file) => fd.append('evidenceFiles', file, file.name));

        this.publicService.submitGrievance(fd).subscribe({
            next: (response: any) => {
                this.isSubmitting = false;
                if (response && response?.data?.ticketId) {
                    this.referenceId = response.data.ticketId;
                    this.submissionSuccess = true;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    // This handles cases where HttpService suppressed the error and returned null
                    this.serverError = 'We are experiencing an internal server issue. Your request could not be completed at this time. Please try again later.';
                }
            },
            error: (err: any) => {
                this.isSubmitting = false;
                this.serverError = this.parseServerError(err);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
        });
    }

    private parseServerError(err: any): string {
        const status: number = err?.status ?? 0;

        if (status === 0) {
            return 'Could not connect to the server. Please check your internet connection and try again.';
        }
        if (status === 413) {
            return 'One or more files are too large. Please upload files under 5 MB each.';
        }
        if (status === 429) {
            return 'Too many requests. Please wait a moment and try again.';
        }
        if (status >= 500) {
            return 'Internal Server Error: Our technical team has been notified. Please try again in a few minutes.';
        }

        // Use backend-provided message if available
        if (err?.error?.message) return err.error.message;
        if (err?.message) return err.message;

        return 'An unexpected error occurred while submitting your grievance. Please try again.';
    }

    /** Fallback reference ID if the API doesn't return one */
    private generateLocalRefId(): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `NC-GR-${timestamp}-${random}`;
    }

    copyRefId(): void {
        navigator.clipboard.writeText(this.referenceId).catch(() => {
            // Clipboard API not available – graceful no-op
        });
    }

    goBack(): void {
        this.location.back();
    }

    goHome(): void {
        this.router.navigate(['/']);
    }

    resetForm(): void {
        this.submissionSuccess = false;
        this.referenceId = '';
        this.selectedFiles = [];
        this.fileError = null;
        this.serverError = null;
        this.buildForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
