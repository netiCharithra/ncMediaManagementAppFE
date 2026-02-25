import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { AdminService } from '../../services/admin.service';
import { StorageService } from '../../services/storage.service';

/** Total OTP duration in seconds (5 min) used for ring calculations */
const OTP_TOTAL_SECONDS = 5 * 60;
/** SVG circle circumference: 2π × 34 ≈ 213.63 */
const RING_CIRC = 2 * Math.PI * 34;
/** Seconds below which the timer turns amber / "warn" */
const WARN_THRESHOLD = 60;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('screenSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(18px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 0, transform: 'translateY(-12px)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChildren('otp1, otp2, otp3, otp4, otp5, otp6')
  otpInputs!: QueryList<ElementRef>;

  requestForm: FormGroup;
  verifyForm: FormGroup;

  otpSent = false;
  loading = false;
  error: string | null = null;

  // Timer
  timeLeft = '05:00';
  isOtpExpired = false;
  isTimeWarn = false;
  /** stroke-dashoffset value for the SVG progress ring */
  timerDashOffset: number = 0;

  // OTP shake micro-interaction
  otpShake = false;

  // Private
  private timer: any;
  private expiresAt = 0;

  public step1Response: any = {};

  touchpadLayout = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['Clear', '0', 'Del'],
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private storageService: StorageService
  ) {
    this.requestForm = this.fb.group({
      identifier: ['', [Validators.required]]
    });

    this.verifyForm = this.fb.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
      otp6: ['', Validators.required],
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this._stopTimer();
  }

  // ═══════════════════════════════════════════
  //  Step 1: Request OTP
  // ═══════════════════════════════════════════
  requestOtp(): void {
    if (this.requestForm.invalid) return;

    this.loading = true;
    this.error = null;

    try {
      this.adminService.loaderService = true;
      this.adminService
        .sendOtp({ identifier: this.requestForm.value.identifier })
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.step1Response = response;
              this.error = null;
              this.otpSent = true;
              this.startTimer(response.expiresAt);
            } else {
              this.error = 'Invalid details. Please contact your supervisor or try again later.';
            }
            this.loading = false;
            this.adminService.loaderService = false;
          },
          error: (err: any) => {
            console.error(err);
            this.error = err?.error?.message ?? 'Something went wrong. Please try again.';
            this.loading = false;
            this.adminService.loaderService = false;
          }
        });
    } catch (err) {
      console.error(err);
      this.loading = false;
      this.adminService.loaderService = false;
    }
  }

  // ═══════════════════════════════════════════
  //  Step 2: Verify OTP
  // ═══════════════════════════════════════════
  verifyOtp(): void {
    if (this.verifyForm.invalid) { this._triggerShake(); return; }
    const otp = Object.values(this.verifyForm.value).join('');

    this.loading = true;
    this.error = null;

    try {
      this.adminService.loaderService = true;
      this.adminService
        .verifyOtp({ identifier: this.requestForm.value.identifier, otp })
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.storageService.setUser(response.userData);
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.error = 'Invalid OTP. Please check and try again.';
              this._triggerShake();
            }
            this.loading = false;
            this.adminService.loaderService = false;
          },
          error: (err: any) => {
            console.error(err);
            this.error = err?.error?.message ?? 'Verification failed. Please try again.';
            this._triggerShake();
            this.loading = false;
            this.adminService.loaderService = false;
          }
        });
    } catch (err) {
      console.error(err);
      this.loading = false;
      this.adminService.loaderService = false;
    }
  }

  // ═══════════════════════════════════════════
  //  Resend
  // ═══════════════════════════════════════════
  resendOtp(): void {
    if (!this.isOtpExpired && this.timeLeft !== '00:00') return;

    this.verifyForm.reset({ otp1: '', otp2: '', otp3: '', otp4: '', otp5: '', otp6: '' });
    this.error = null;
    this.isOtpExpired = false;
    this.requestOtp();
  }

  // ═══════════════════════════════════════════
  //  Go Back
  // ═══════════════════════════════════════════
  goBack(): void {
    this.otpSent = false;
    this.error = null;
    this.isOtpExpired = false;
    this.isTimeWarn = false;
    this.requestForm.reset();
    this.verifyForm.reset();
    this._stopTimer();
    this.timeLeft = '05:00';
    this.timerDashOffset = 0;
  }

  // ═══════════════════════════════════════════
  //  Timer
  // ═══════════════════════════════════════════
  startTimer(expiresAt: number): void {
    this._stopTimer();
    this.expiresAt = expiresAt;
    this.isOtpExpired = false;
    this.isTimeWarn = false;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const timeRemaining = this.expiresAt - now;

      if (timeRemaining <= 0) {
        this.timeLeft = '00:00';
        this.isOtpExpired = true;
        this.isTimeWarn = false;
        this.timerDashOffset = RING_CIRC;
        this._stopTimer();
        return;
      }

      this.isOtpExpired = false;
      this.isTimeWarn = timeRemaining <= WARN_THRESHOLD;

      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      this.timeLeft = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      // Dash offset: 0 = full ring, RING_CIRC = empty ring
      const elapsed = OTP_TOTAL_SECONDS - timeRemaining;
      this.timerDashOffset = (elapsed / OTP_TOTAL_SECONDS) * RING_CIRC;
    };

    updateTimer();
    this.timer = setInterval(updateTimer, 1000);
  }

  // ═══════════════════════════════════════════
  //  OTP Input Handling
  // ═══════════════════════════════════════════
  onOtpInput(current: HTMLInputElement, next?: HTMLInputElement): void {
    // Only allow digits
    current.value = current.value.replace(/[^0-9]/g, '');
    const controlName = current.id; // e.g. "otp1"
    this.verifyForm.get(controlName)?.setValue(current.value);

    if (current.value.length === 1 && next) {
      next.focus();
    }
  }

  /** Handle backspace to move focus backwards */
  onOtpKeydown(event: KeyboardEvent, prev: HTMLInputElement | null, current: HTMLInputElement): void {
    if (event.key === 'Backspace' && !current.value && prev) {
      prev.focus();
      // Let the default behavior clear the previous field
    }
  }

  onKeypadClick(key: string): void {
    const controls = this.verifyForm.controls;
    const otpKeys = Object.keys(controls);

    if (key === 'Del') {
      for (let i = otpKeys.length - 1; i >= 0; i--) {
        if (controls[otpKeys[i]].value) {
          controls[otpKeys[i]].setValue('');
          this._focusOtpIndex(i);
          break;
        }
      }
    } else {
      for (let i = 0; i < otpKeys.length; i++) {
        if (!controls[otpKeys[i]].value) {
          controls[otpKeys[i]].setValue(key);
          if (i < otpKeys.length - 1) this._focusOtpIndex(i + 1);
          break;
        }
      }
    }
    this._syncFormFromDom();
  }

  clearOtp(): void {
    this.verifyForm.reset({ otp1: '', otp2: '', otp3: '', otp4: '', otp5: '', otp6: '' });
    this.otpInputs?.first?.nativeElement?.focus();
  }

  // ═══════════════════════════════════════════
  //  Private helpers
  // ═══════════════════════════════════════════
  private _stopTimer(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  private _triggerShake(): void {
    this.otpShake = true;
    setTimeout(() => (this.otpShake = false), 600);
  }

  private _focusOtpIndex(index: number): void {
    const el = document.querySelector(`#otp${index + 1}`) as HTMLElement | null;
    el?.focus();
  }

  private _syncFormFromDom(): void {
    const inputs = this.otpInputs?.toArray().map(i => i.nativeElement) ?? [];
    if (inputs.length === 6) {
      this.verifyForm.setValue({
        otp1: inputs[0].value,
        otp2: inputs[1].value,
        otp3: inputs[2].value,
        otp4: inputs[3].value,
        otp5: inputs[4].value,
        otp6: inputs[5].value,
      });
    }
  }
}