import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  public metaData:any={};
  public topSectionData:any = [];
  public categoryWiseRecentRecords:any = [];
  public moreRecentRecords:any = [];
  constructor(private appService: AppServiceService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    this.getHomeData();
    this.getMetaData();
  }

  getHomeData = () => {
    try {
      this.appService.getHomeData({}).subscribe((response) => {
        if (response.status === 'success') {
          this.topSectionData = response.data.mostRecentRecords ||[];
          this.categoryWiseRecentRecords = response.data.categoryWiseRecentRecords ||[];
          this.moreRecentRecords = response.data.moreRecentRecords ||[];
          this.alertService.open("success", "Success", response.msg || " ");
          console.log(this.topSectionData)
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      }, (error)=>{
        console.error(error);
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;
    }
  }


  getMetaData = () => {
    try {
      const metaList = ['NEWS_CATEGORIES']

      this.appService.getMetaData({ metaList }).subscribe((response) => {
        if (response.status === 'success') {
          if(response.data){
            this.metaData = { ...this.metaData , ...response.data}
          }
          // console.log(response)
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      }, (error) => {
        console.error(error);
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error)
    }
  }

  onNewsClick = (newsInfo:any, category?:any)=>{
    try {
      let queryParams = {
        newsId: newsInfo['newsId']
      };
      if (category){
        queryParams['category'] = category;
      }

      // let queryStr = '?newsId=' + queryParams['newsId'] + '&category='+queryParams['category']
      // this.router.navigate(['/view-news' + queryStr]);
      this.router.navigate(['/view-news'], { queryParams :  queryParams });
    } catch (error) {
      console.error(error)
    }
  }
}
