import { Component, OnInit } from '@angular/core';
import { AppServiceService } from '../../services/app-service.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'nc-web-management-login',
  templateUrl: './management-login.component.html',
  styleUrl: './management-login.component.scss'
})
export class ManagementLoginComponent implements OnInit {

  public loginFormValues:any={
    mail:'',
    password:''
  };
  constructor(private appService: AppServiceService, private alertService: AlertService, public router: Router, private storage:StorageService) { }

  ngOnInit(): void {
  }

  loginCreds = () =>{
    try {
      this.appService.loaderService=true;
      this.appService.userLogin(this.loginFormValues).subscribe((response) => {
        if(response.status === 'success'){
          this.storage.api.session.save('userData',response.data)
          this.router.navigate(['/app']);
        } else {
          this.alertService.open("error", response.status.charAt(0).toUpperCase() + response.status.slice(1) , response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }

  navigate = (type?:any) => {
    this.router.navigate(['/signup'])
  }
}
