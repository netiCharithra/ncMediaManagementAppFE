import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';

@Component({
  selector: 'your-status',
  templateUrl: './your-status.component.html',
  styleUrls: ['./your-status.component.scss']
})
export class YourStatusComponent implements OnInit {
  userName = 'John Doe';
  idNumber = 'PR12345';
  designation = 'Reporter';
  area = 'City News';
  bloodGroup = 'O+';
  public responseData:any;
  public notANCUser:boolean=false;
  public visible:boolean=false;
  constructor(private appService: AppServiceService, private alertService: AlertService, private route: ActivatedRoute) {


   }

  ngOnInit(): void {
    this.checkStatus({ activeTraceId: this.route.snapshot.params['id']})
  }

  // In your component class
  getTextColor(status: string): string {
    switch (status) {
      case 'expired':
        return 'red';
      case 'inactive':
        return 'darkyellow';
      case 'active':
        return 'green';
      default:
        return 'black'; // or any default color you want
    }
  }
  checkStatus = (payload) => {

  
    this.appService.employeeTracingCheck( payload ).subscribe((response) => {
      if (response.status === 'success') {
        this.visible = true;
        this.alertService.open('success', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Success !");
        this.responseData = response.data[0] || {};
        this.notANCUser=false;
        // this.listingTable = { ...response['data'] || {}, currentPage: this.pageNumber };

        setTimeout(() => {
          if(this.responseData?.['status'] === 'expired' || this.responseData?.['status'] === 'invalid'){
            this.visible = true;
          } else {
            this.visible = false;
          }
        }, 1500);
      } else if(response.status === 'invalid'){
        this.notANCUser = true;
        this.responseData = {};
      } else {
        this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
      }
      this.appService.loaderService = false;
    })
  }

}
