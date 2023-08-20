import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';
import { StorageService } from 'app/services/storage.service';

@Component({
  selector: 'employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  public employeeTables: any = {};

  public signUpFormValues: any = {};
  public metaData: any = {
    "ROLE": [],
    "STATES": []
  };
  public actionType:any='';
  public disableFields:Boolean=false;
  constructor(private appService: AppServiceService, private alertService: AlertService, private storage: StorageService, private router: Router) { }

  public identityVerificationRejectionReason:any;
  ngOnInit(): void {
    this.getEmployeesData();
  }

  getEmployeesData = () => {
    try {
      this.appService.loaderService = true;
      this.appService.getEmployeesData({}).subscribe((response) => {
        if (response.status === 'success') {
          this.employeeTables = response['data'] || {};
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;
    }
  }
  // getEmployeesData

  actionEmitter = (event) => {
    try {
      this.actionType='';
      this.disableFields=false;
      this.signUpFormValues={};
      if (event.type ==='create'){
        this.disableFields=false;
        this.getMetaData();
        this.actionType=event.type
        document.getElementById('addEmployeeBtn').click();
      } else if (event.type === 'active'){
        this.actionType = event.type;
        this.getMetaData(null,true);
        this.disableFields = true;
        this.getEmployeeData(event);
      } else if (event.type === 'inactive'){
        this.actionType = event.type;
        this.getMetaData(null,true);
        this.disableFields = true;
        this.getEmployeeData(event);
      } else if (event.type === 'disable'){
        this.actionType = event.type;
        this.getMetaData(null,true);
        this.disableFields = true;
        this.getEmployeeData(event);
      
      } else if (event.type === 'enable'){
        this.actionType = event.type;
        this.getMetaData(null,true);
        this.disableFields = true;
        this.getEmployeeData(event);
      } else if (event.type === 'edit') {
        this.actionType = event.type;
        this.getMetaData(null, true);
        this.disableFields = false;
        this.getEmployeeData(event);
      } else if (event.type === 'verify_identity') {
        this.actionType = event.type;
        this.getEmployeeData(event, event.type);
        this.identityVerificationRejectionReason='';
      }
    } catch (error) {
      console.error(error)
    }
  }



  getEmployeeData = (event, eventType?:any) => {
    try {
      this.appService.loaderService = true;
      this.appService.getEmployeeData({ data:event.rowData }).subscribe((response) => {
        if(response.status==='success'){
          this.signUpFormValues = response.data;
          if (eventType && eventType === 'verify_identity'){
            if (!response.data.profilePicture ){
              this.alertService.open("error", "Profile Picture Not Available", 'Profile Picture not uploaded!');
              return
            }
            if (!response.data.identityProof ){
              this.alertService.open("error", "Document Not Available", 'Idenity Proof not uploaded!');
              return
            }
            document.getElementById('identityVerifactionBtn').click();
          } else {
            document.getElementById('addEmployeeBtn').click();

          }
        } else {
          this.alertService.open("error","Failed", response.msg || 'failed');
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;
    }
  }
  getMetaData = (stateId?: any, callFurtercalls?:any) => {
    try {
      // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
      this.appService.loaderService = true;
      const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS'] : ['STATES', 'ROLE']
      this.appService.getMetaData({ metaList }).subscribe((response) => {
        this.metaData = { ...this.metaData, ...response['data'] || {} }
        if (callFurtercalls){
          this.getMetaData(this.signUpFormValues.state)
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }

  dataTOVerify(event){
    console.log(event)
  }

  changeOfState = () => {
    try {
      this.metaData[this.signUpFormValues['state'] + '_DISTRICTS'] = [];
      this.metaData[this.signUpFormValues['state'] + '_DISTRICT_MANDALS'] = [];
      this.getMetaData(this.signUpFormValues['state'])
    } catch (error) {
      console.error(error)
    }
  }

  signUpCreds = () => {
    try {
      this.appService.loaderService = true;
      const userData = this.storage.api.session.get('userData'); 
      this.appService.manipulateEmployee({type:this.actionType, data:this.signUpFormValues}).subscribe((response) => {
        if (response.status === 'success') {
          this.alertService.open("success", "Success", response.msg || " ");
          document.getElementById('addEmployeeBtn').click();
          if (userData.employeeId === this.signUpFormValues.employeeId) {
            setTimeout(() => {
              this.alertService.open("info", "Info", "Profile Updated... Kindly relogin");
              this.storage.api.session.remove('userData');
              this.router.navigate(['']);
            }, 500);
          } else {
            this.getEmployeesData();
          }
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;
    }
  }
  updateVerification = (status) => {
    try {
      this.appService.loaderService = true;
      this.appService.manipulateEmployee({ type: this.actionType, data: this.signUpFormValues, status: status, reason: this.identityVerificationRejectionReason }).subscribe((response) => {
        if (response.status === 'success') {
          this.alertService.open("success", "Success", response.msg || " ");
          document.getElementById('identityVerifactionBtn').click();
          const userData = this.storage.api.session.get('userData'); 
          if (userData.employeeId === this.signUpFormValues.employeeId){
            setTimeout(() => {
              this.alertService.open("info", "Info", "Profile Updated... Kindly relogin");
              this.storage.api.session.remove('userData');
              this.router.navigate(['']);
            }, 500);
          } else {
            this.getEmployeesData();
          }
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error)
      this.appService.loaderService = false;
    }
  }

}
