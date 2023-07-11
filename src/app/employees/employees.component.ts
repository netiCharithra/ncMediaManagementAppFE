import { Component, OnInit } from '@angular/core';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';

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
  constructor(private appService: AppServiceService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getEmployeesData();
  }

  getEmployeesData = () => {
    try {
      this.appService.getEmployeesData({}).subscribe((response) => {
        // this.toaster.toast('error', 'Error', response.msg || "MESSS", true);
        console.log(response)
        if (response.status === 'success') {
          console.log(response['data']);
          this.employeeTables = response['data'] || {}
          // this.alertService.open("success", "Success", response.msg || " ");
          // this.router.navigate(['/login']);
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
      })
    } catch (error) {
      console.error(error)
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
      }
      console.log(event)
    } catch (error) {
      console.error(error)
    }
  }



  getEmployeeData = (event) => {
    try {
      this.appService.getEmployeeData({ data:event.rowData }).subscribe((response) => {
        console.log(response)
        if(response.status==='success'){
          this.signUpFormValues = response.data;
          document.getElementById('addEmployeeBtn').click();
        } else {
          this.alertService.open("error","Failed", response.msg || 'failed');
        }
        
      })
    } catch (error) {
      console.error(error)
    }
  }
  getMetaData = (stateId?: any, callFurtercalls?:any) => {
    try {
      // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
      const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS'] : ['STATES', 'ROLE']
      this.appService.getMetaData({ metaList }).subscribe((response) => {
        console.log(response)
        this.metaData = { ...this.metaData, ...response['data'] || {} }
        if (callFurtercalls){
          this.getMetaData(this.signUpFormValues.state)
        }
        console.log(this.metaData)
      })
    } catch (error) {
      console.error(error)
    }
  }


  changeOfState = () => {
    try {
      console.log(this.signUpFormValues['state'])
      this.metaData[this.signUpFormValues['state'] + '_DISTRICTS'] = [];
      this.metaData[this.signUpFormValues['state'] + '_DISTRICT_MANDALS'] = [];
      this.getMetaData(this.signUpFormValues['state'])
    } catch (error) {
      console.error(error)
    }
  }

  signUpCreds = () => {
    console.log(this.signUpFormValues);
    try {
      this.appService.manipulateEmployee({type:this.actionType, data:this.signUpFormValues}).subscribe((response) => {
        // this.toaster.toast('error', 'Error', response.msg || "MESSS", true);
        console.log(response)
        if (response.status === 'success') {
          this.alertService.open("success", "Success", response.msg || " ");
          document.getElementById('addEmployeeBtn').click();
          this.getEmployeesData();
          // this.router.navigate(['/login']);
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
}
