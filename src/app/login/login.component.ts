import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';
import { StorageService } from 'app/services/storage.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginFormValues:any={
    mail:'',
    password:''
  };
  constructor(private appService: AppServiceService, private alertService: AlertService, public router: Router, private storage:StorageService) { }

  ngOnInit(): void {
  }

  loginCreds = () =>{
    console.log(this.loginFormValues)
    try {
      this.appService.userLogin(this.loginFormValues).subscribe((response) => {
        // this.toaster.toast('error', 'Error', response.msg || "MESSS", true);
        // this.alertService.open("success", "Success",response.msg || "MSEE")
        if(response.status === 'success'){
          this.storage.api.session.save('userData',response.data)
          // console.log(success)
          this.router.navigate(['/app']);
        } else {
          this.alertService.open("error", response.status.charAt(0).toUpperCase() + response.status.slice(1) , response.msg || "Failed !")
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  navigate = (type?:any) => {
    this.router.navigate(['/signup'])
  }
}
