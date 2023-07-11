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
  ngOnInit(): void {
    this.getSubscribers();
  }

  getSubscribers = () => {
    try {
      this.tableData={};
      this.appService.getSubscribers({}).subscribe((response) => {
        // this.toaster.toast('error', 'Error', response.msg || "MESSS", true);
        if (response.status === 'success') {
          this.tableData = response.data || {}
        } else {
          this.alertService.open("error", response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
}
