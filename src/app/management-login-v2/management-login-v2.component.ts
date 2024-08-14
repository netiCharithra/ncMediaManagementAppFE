// import { Component } from '@angular/core';

// @Component({
//   selector: 'nc-web-management-login-v2',
//   standalone: true,
//   imports: [],
//   templateUrl: './management-login-v2.component.html',
//   styleUrl: './management-login-v2.component.scss'
// })
// export class ManagementLoginV2Component {

// }

import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AppServiceService } from '../services/app-service.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'nc-web-management-login-v2',
  standalone: true,
  // imports: [],
  templateUrl: './management-login-v2.component.html',
  styleUrl: './management-login-v2.component.scss',
  // selector: 'app-management-login-v2',
  // standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ]
})
export class ManagementLoginV2Component {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);

  constructor(private appService:AppServiceService, private storage:StorageService, public router: Router, private alertService:AlertService){

  }

  loginCreds() {
    if (this.isFormValid()) {

      console.log("R",this.emailFormControl.value)


      let payload={
        mail:this.emailFormControl.value,
        password:this.passwordFormControl.value
      }

      this.appService.loaderService=true;
      this.appService.userLogin(payload).subscribe((response) => {
        if(response.status === 'success'){
          this.storage.api.session.save('userData',response.data)
          this.router.navigate(['/admin']);
        } else {
          this.alertService.open("error", response.status.charAt(0).toUpperCase() + response.status.slice(1) , response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
      // Implement login logic here
      console.log('Login attempted', payload);
    }
  }

  isFormValid(): boolean {
    return this.emailFormControl.valid && this.passwordFormControl.valid;
  }

  navigate(route: string) {
    // Implement navigation logic here
    console.log(`Navigating to ${route}`);
  }
}