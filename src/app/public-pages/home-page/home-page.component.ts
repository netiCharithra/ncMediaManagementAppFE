import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';
import { Subscription } from 'rxjs';

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

  private paramMapSubscription: Subscription;
  private queryParamSubscription: Subscription;
  constructor(public appService: AppServiceService, private alertService: AlertService, private router: Router, private route: ActivatedRoute) {
    this.queryParamSubscription = this.route.queryParamMap.subscribe((queryParams) => {
      const queryParamValue = queryParams.get('yourQueryParamName'); // Replace with your actual query param name
      console.log('Query parameter changed:', queryParamValue);
    });
   }

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
      this.router.navigate(['/view-news', newsInfo['newsId']]);
    } catch (error) {
      console.error(error)
    }
  }
}
