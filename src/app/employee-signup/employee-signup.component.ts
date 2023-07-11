import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';
import { StorageService } from 'app/services/storage.service';

@Component({
  selector: 'employee-signup',
  templateUrl: './employee-signup.component.html',
  styleUrls: ['./employee-signup.component.scss']
})
export class EmployeeSignupComponent implements OnInit {
public signUpFormValues: any = {};
public metaData:any={
  "ROLE":[],
  "STATES":[]
};

  constructor(private appService: AppServiceService, private alertService: AlertService, public router: Router, private storage: StorageService) { }

  ngOnInit(): void {
    this.getMetaData();
  }

  getMetaData = (stateId?:any) =>{
    try {
      // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
      const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS'] : ['STATES', 'ROLE']
      this.appService.getMetaData({metaList}).subscribe((response) => {
        console.log(response)
        this.metaData = { ...this.metaData , ...response['data'] || {}}
        console.log(this.metaData)
      })
    } catch (error) {
      console.error(error)
    }
  }


  changeOfState = () => {
    try {
      console.log(this.signUpFormValues['state'])
      this.metaData[this.signUpFormValues['state']+'_DISTRICTS']=[];
      this.metaData[this.signUpFormValues['state'] +'_DISTRICT_MANDALS']=[];
      this.getMetaData(this.signUpFormValues['state'])
    } catch (error) {
      console.error(error)
    }
  }

  signUpCreds = () => {
    console.log(this.signUpFormValues)
    try {
      this.appService.registerEmploye(this.signUpFormValues).subscribe((response) => {
        // this.toaster.toast('error', 'Error', response.msg || "MESSS", true);
        console.log(response)
        if (response.status === 'success') {
          this.alertService.open("success", "Success", response.msg || " ");
          this.router.navigate(['/login']);
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  navigate = (type?: any) => {
    this.router.navigate(['/singup'])
  }

}
