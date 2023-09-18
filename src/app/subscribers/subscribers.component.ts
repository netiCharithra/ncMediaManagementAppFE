import { Component, OnInit } from '@angular/core';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';

@Component({
  selector: 'subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss']
})
export class SubscribersComponent implements OnInit {

  constructor(private appService:AppServiceService, private alertService:AlertService) { }
  public tableData:any={};
  public tableMetaData:any={
    title:"Subscribers"
  }
  public metaData:any={
    "STATES": []
  }

  public subscriberFormValue:any={}
  ngOnInit(): void {
    this.getSubscribers();
  }

  getSubscribers = () => {
    try {
      this.appService.loaderService = true;
      this.tableData={};
      this.appService.getSubscribers({}).subscribe((response) => {
        // this.toaster.toast('error', 'Error', response.msg || "MESSS", true);
        if (response.status === 'success') {
          this.tableData = response.data.tableData || {};
          if(response.data?.metaData){
            this.tableMetaData = {...this.tableMetaData, ...response.data.metaData}
          }
        } else {
          this.alertService.open("error", response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }


  actionEmitter = (event) => {
    try {
      this.subscriberFormValue = {};
      if (event.type === 'create') {
        // this.disableFields = false;
        this.getMetaData();
        // this.actionType = event.type
        document.getElementById('addEmployeeBtn').click();
      } else if(event.type === 'addToGroup'){
        this.addSubscriberToGropup(event.rowData)
      }
    } catch (error) {
      console.error(error)
    }
  }


  getMetaData = (stateId?: any, callFurtercalls?: any) => {
    try {
      // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
      this.appService.loaderService = true;
      const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS'] : ['STATES', 'ROLE']
      this.appService.getMetaData({ metaList }).subscribe((response) => {
        this.metaData = { ...this.metaData, ...response['data'] || {} }
        if (callFurtercalls) {
          this.getMetaData(this.subscriberFormValue.state)
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }

  changeOfState = () => {
    try {
      this.metaData[this.subscriberFormValue['state'] + '_DISTRICTS'] = [];
      this.metaData[this.subscriberFormValue['state'] + '_DISTRICT_MANDALS'] = [];
      this.getMetaData(this.subscriberFormValue['state'])
    } catch (error) {
      console.error(error)
    }
  }

  
  addSubscriberToGropup = (data) => {
    // console.log(this.subscriberFormValue)



    try {
      this.appService.loaderService = true;
      this.appService.addSubscriberToGroup({ data: data }).subscribe((response) => {
        if (response.status === 'success') {
          // document.getElementById('addEmployeeBtn').click();
          setTimeout(() => {
            this.alertService.open("success", response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Success !");
            this.getSubscribers();
          }, 300);
        } else {
          this.alertService.open("error", response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      }, (error)=> {
        this.appService.loaderService = false;
        console.error(error)

      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }
  addSubscriber = () => {
    // console.log(this.subscriberFormValue)



    try {
      this.appService.loaderService = true;
      this.appService.addSubscribers({ data: this.subscriberFormValue}).subscribe((response) => {
        if (response.status === 'success') {
          document.getElementById('addEmployeeBtn').click();
          this.alertService.open("success", response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Success !");
          this.getSubscribers();
        } else {
          this.alertService.open("error", response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      }, (error)=> {
        this.appService.loaderService = false;
        console.error(error)

      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }
}
