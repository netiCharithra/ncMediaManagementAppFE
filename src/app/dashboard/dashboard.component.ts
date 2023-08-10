import { Component, OnInit } from '@angular/core';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public dashboardData:any={}
  constructor(private appService: AppServiceService, private alertService:AlertService) { }

  getDashboardData = () => {
    try {
      this.appService.loaderService = true;
      
      this.dashboardData = {};
      this.appService.getDashboardData({}).subscribe((response) => {
        if (response.status === 'success') {
          this.dashboardData = response.data || {}
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

  lengthOfObjectKeys = (obj) => {
    return Object.keys(obj)
  }
  ngOnInit() {
    this.getDashboardData();
  }

}
