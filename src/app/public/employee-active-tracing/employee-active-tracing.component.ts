import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicService } from '../services/public.service';
import { MessageService } from '../../admin/services/message.service';

@Component({
  selector: 'app-employee-active-tracing',
  templateUrl: './employee-active-tracing.component.html',
  styleUrl: './employee-active-tracing.component.scss'
})
export class EmployeeActiveTracingComponent {
  userName = 'John Doe';
  idNumber = 'PR12345';
  designation = 'Reporter';
  area = 'City News';
  bloodGroup = 'O+';
  public responseData:any;
  public notANCUser:boolean=false;
  public visible:boolean=false;
  constructor(private publicService: PublicService, private alertService: MessageService, private route: ActivatedRoute) {


   }

  ngOnInit(): void {
    this.checkStatus({ activeTraceId: this.route.snapshot.params['employeeId']})
  }

  // In your component class
  getTextColor(status: string): string {
    switch (status) {
      case 'expired':
        return 'red';
      case 'inactive':
        return '#717100';
      case 'active':
        return 'green';
      default:
        return 'black'; // or any default color you want
    }
  }
  checkStatus = (payload:any) => {

  
    this.publicService.employeeTraceCheck( payload ).subscribe((response:any) => {
      if (response) {
        this.visible = true;
        // this.alertService.showInfo(response.status.charAt(0).toUpperCase() + response.status.slice(1));
        this.responseData = response[0] || {};
        this.notANCUser=false;
        // this.listingTable = { ...response['data'] || {}, currentPage: this.pageNumber };

        setTimeout(() => {
          if(this.responseData?.['status'] === 'expired' || this.responseData?.['status'] === 'inactive'){
            this.visible = true;
          } else {
            this.visible = false;
          }
        }, 1500);
      } else if(response.status === 'invalid'){
        this.notANCUser = true;
        this.responseData = {};
      } else {
        this.alertService.showError(response.status.charAt(0).toUpperCase() + response.status.slice(1));
      }
    })
  }

}
