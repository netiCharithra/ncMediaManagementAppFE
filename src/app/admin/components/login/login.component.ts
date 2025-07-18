import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChildren('otp1, otp2, otp3, otp4, otp5, otp6') otpInputs!: QueryList<ElementRef>;

  requestForm: FormGroup;
  verifyForm: FormGroup;

  otpSent = false;
  loading = false;
  error: string | null = null;
  timeLeft: string = '05:00'; // 5 minutes default
  isOtpExpired: boolean = false;
  private timer: any;

  touchpadLayout = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['Clear', '0', 'Del'],
  ];

  public step1Response:any={};

  constructor(private fb: FormBuilder, private router: Router, private adminService: AdminService, private storageService: StorageService) {
    this.requestForm = this.fb.group({
      identifier: ['', [Validators.required]]
    });

    this.verifyForm = this.fb.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
      otp6: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Step 1: Request OTP
  requestOtp(): void {
    if (this.requestForm.invalid) {
      return;
    }
    console.log('Requesting OTP for:', this.requestForm.value.identifier);
    this.loading = true;
    this.error = null;

    try {
      this.adminService.loaderService = true;
      this.adminService.sendOtp({ ...{ identifier: this.requestForm.value.identifier } }).subscribe((response: any) => {
        if (response) {
          console.log("response", response);
          this.step1Response = response;
          this.error = '';
          this.otpSent = true;
          this.startTimer(response.expiresAt);
          this.loading = false;
        } else {
          this.error = 'Invalid Details. Kindly Contact your supervisor or try again later!';
          this.loading = false;
        }
        this.adminService.loaderService = false;
      });
    } catch (error) {
      this.adminService.loaderService = false;
      console.error(error);
      this.loading = false;
    }

    // // --- Placeholder for backend integration ---
    // setTimeout(() => {
    //   this.loading = false;
    //   this.otpSent = true;
    //   this.startTimer();
    // }, 1000);
  }

  // Step 2: Verify OTP
  verifyOtp(): void {
    if (this.verifyForm.invalid) {
      return;
    }
    const otp = Object.values(this.verifyForm.value).join('');
    console.log('Verifying OTP:', otp);
    this.loading = true;
    this.error = null;

    try {
      this.adminService.loaderService = true;
      this.adminService.verifyOtp({ ...{ identifier: this.requestForm.value.identifier, otp } }).subscribe((response: any) => {
        if (response) {
          console.log("response after otp veridt", response);

          this.storageService.setUser(response.userData);
          this.router.navigate(['/admin/dashboard']);


          this.error = '';
          // this.otpSent = true;
          // this.startTimer(response.expiresAt);
          this.loading = false;
          // this.adminService.loaderService = false;
          // this.router.navigate(['/admin/dashboard']);
        } else {
          this.error = 'Invalid Details. Kindly Contact your supervisor or try again later!';
          this.loading = false;
        }
        this.adminService.loaderService = false;
      });
    } catch (error) {
      this.adminService.loaderService = false;
      console.error(error);
      this.loading = false;
    }

    // --- Placeholder for backend integration ---
    // setTimeout(() => {
    //   this.loading = false;
    //   if (otp === '123456') { // Mock success
    //     console.log('Login successful');
    //     // this.router.navigate(['/admin/dashboard']);
    //   } else { // Mock failure
    //     this.error = 'Invalid OTP. Please try again.';
    //   }
    // }, 1000);
  }

  resendOtp(): void {
    // Only allow resend if OTP is expired or timer is at 00:00
    if (this.isOtpExpired || this.timeLeft === '00:00') {
      // Clear the existing OTP values
      this.verifyForm.reset({
        otp1: '',
        otp2: '',
        otp3: '',
        otp4: '',
        otp5: '',
        otp6: ''
      });
      this.error = null;
      this.isOtpExpired = false;
      console.log('Requesting new OTP...');
      // Reset the form and request new OTP
      this.requestOtp();
    }
  }

  startTimer(expiresAt: number): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const timeRemaining = expiresAt - now;

      if (timeRemaining <= 0) {
        this.timeLeft = '00:00';
        this.isOtpExpired = true;
        clearInterval(this.timer);
        return;
      }

      this.isOtpExpired = false;
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      this.timeLeft = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Initialize state
    this.isOtpExpired = false;
    
    // Update immediately
    updateTimer();

    // Then update every second
    this.timer = setInterval(updateTimer, 1000);
  }

  onOtpInput(current: HTMLInputElement, next?: HTMLInputElement): void {
    if (current.value.length === 1 && next) {
      next.focus();
    }
  }

  onKeypadClick(key: string): void {
    const controls = this.verifyForm.controls;
    const otpKeys = Object.keys(controls);

    if (key === 'Del') {
      // Find the last input with a value and clear it
      for (let i = otpKeys.length - 1; i >= 0; i--) {
        if (controls[otpKeys[i]].value) {
          controls[otpKeys[i]].setValue('');
          // Focus the cleared input
          const prevInput = document.querySelector(`#otp${i + 1}`) as HTMLElement;
          if (prevInput) {
            prevInput.focus();
          }
          break;
        }
      }
    } else if (key === 'Clear') {
      // Clear all inputs
      otpKeys.forEach((key) => {
        controls[key].setValue('');
      });
      // Focus the first input
      const firstInput = document.querySelector(`#otp1`) as HTMLElement;
      if (firstInput) {
        firstInput.focus();
      }
    } else {
      // Find the first empty input and fill it
      for (let i = 0; i < otpKeys.length; i++) {
        if (!controls[otpKeys[i]].value) {
          controls[otpKeys[i]].setValue(key);
          // Focus the next input if it exists
          if (i < otpKeys.length - 1) {
            const nextInput = document.querySelector(`#otp${i + 2}`) as HTMLElement;
            if (nextInput) {
              nextInput.focus();
            }
          }
          break;
        }
      }
    }
    this.updateVerifyForm();
  }

  private updateVerifyForm(): void {
    const inputs = this.otpInputs.toArray().map(i => i.nativeElement);
    this.verifyForm.setValue({
      otp1: inputs[0].value,
      otp2: inputs[1].value,
      otp3: inputs[2].value,
      otp4: inputs[3].value,
      otp5: inputs[4].value,
      otp6: inputs[5].value,
    });
  }

  clearOtp(): void {
    this.verifyForm.reset({ otp1: '', otp2: '', otp3: '', otp4: '', otp5: '', otp6: '' });
    this.otpInputs.first.nativeElement.focus();
  }

  goBack(): void {
    this.otpSent = false;
    this.error = null;
    this.isOtpExpired = false;
    this.requestForm.reset();
    this.verifyForm.reset();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.timeLeft = '05:00';
  }
}