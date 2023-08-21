import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';

@Component({
  selector: 'category-news',
  templateUrl: './category-news.component.html',
  styleUrls: ['./category-news.component.scss']
})
export class CategoryNewsComponent implements OnInit {

  public paramPayload: any={};
  public pageData: any={};
  public endOfRecords: boolean=false;
  public payload:any={
    page:1,
    count:2
  };

  constructor(private route: ActivatedRoute, public appService: AppServiceService, private alertService: AlertService) {
    this.payload['category'] = this.route.snapshot.params['id'];
    this.route.paramMap.subscribe((params: Params) => {

      const newParamValue = params.get('id');

      if (this.payload['category'] !== newParamValue){
        this.payload['category'] = newParamValue;
        this.getNewsInfo();
      }
      console.log(newParamValue);
    });
  }

  ngOnInit(): void {
    if (this.payload['category']) {
      this.getNewsInfo();
    }
  }

  getNewsInfo = (loadMore?:any) => {
    try {
      this.appService.loaderService = true;

      if(!loadMore){
        this.pageData['records']={};
        this.payload['page']=1;
        this.payload['count']=2;
      }
      this.appService.getCategoryNews(this.payload).subscribe((response) => {
        if (response.status === 'success') {
          if (response.data) {
            if (!loadMore){
              this.pageData = response.data || {};
              
            } else {
              this.pageData['records'] = this.pageData['records'].concat(response?.data?.records || []);
              this.pageData['recentRecords'] = response?.data?.recentRecords || [];
            }
            this.endOfRecords = response?.data?.endOfRecords;
            console.log(this.endOfRecords)
            if (!response?.data?.endOfRecords) {
              this.payload.page = this.payload.page+1;
            }
            console.log(this.pageData)
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
      this.appService.loaderService = false;
      console.error(error)
    }
  }
  images = [
    { src: 'https://techmonitor.ai/wp-content/uploads/sites/4/2017/02/shutterstock_552493561.webp', alt: 'Image 1' },
    { src: 'https://techmonitor.ai/wp-content/uploads/sites/4/2017/02/shutterstock_552493561.webp', alt: 'Image 2' },
    { src: 'https://techmonitor.ai/wp-content/uploads/sites/4/2017/02/shutterstock_552493561.webp', alt: 'Image 3' }
  ];

  getImageDivStyle(images) {

    let width = 100;
    let height;
    if ((window.innerWidth / 16) > 30 && images?.length) {
      width = 100 / images.length
    }
    if (images.length === 1 && (window.innerWidth / 16) > 50) {
      height = `calc(100vh - 20rem)`
    }
    // const width = this.calculateWidth(); // Call your function to calculate width
    let retruObj = { 'width': `calc(${width}% - 10px` };
    if (height) {
      retruObj[`height`] = `${height}`;
    }
    return retruObj
  }

  getImageTagStyle(images) {
    let height = '100%';
    let width = '100%';

    if ((window.innerWidth / 16) > 50 && images.length === 1) {
      height = "inherit";
      width = 'unset';
    }
    // if ((window.innerWidth / 16) > 30 && images.length === 1){
    //   // TAB MODE

    // }
    // const width = this.calculateWidth(); // Call your function to calculate width
    return { 'height': `${height}`, 'width': `${width}` };
  }

}
