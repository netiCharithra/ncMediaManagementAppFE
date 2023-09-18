import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';

@Component({
  selector: 'view-news',
  templateUrl: './view-news.component.html',
  styleUrls: ['./view-news.component.scss']
})
export class ViewNewsComponent implements OnInit {

  public paramPayload:any={};
  public pageData:any;

  constructor(private route: ActivatedRoute, private appService: AppServiceService, private alertService: AlertService, private router:Router) {
    this.paramPayload['newsId'] = this.route.snapshot.params['id'];
    // this.route.queryParams.subscribe(params => {
    //   if (params){
    //     this.paramPayload = JSON.parse(JSON.stringify(params));
    //   };
    // });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // The route has changed
        // console.log('Route has changed:', event);
        // console.log(this.route.snapshot.params['id'])

        if (this.paramPayload['newsId'] !== this.route.snapshot.params['id']){
          this.paramPayload['newsId'] = parseInt(this.route.snapshot.params['id'])
          // this.paramPayload['newsId'] = parseInt(this.paramPayload['newsId'])
          this.getNewsInfo();
        }
      }
    });
   }

  ngOnInit(): void {
    if(this.paramPayload['newsId']){
      this.paramPayload['newsId'] = parseInt(this.paramPayload['newsId'])
      this.getNewsInfo();
    }
    // if (this.paramPayload){
    // }
  }

  getNewsInfo = () => {
    try {
      // this.pageData=null;
      this.appService.loaderService = true;
      this.appService.getPublicNewsInfo(this.paramPayload).subscribe((response) => {
        if (response.status === 'success') {
          if (response.data) {
            this.pageData=response.data || {};
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
    if ((window.innerWidth/16)>30 && images?.length){
      width = 100/images.length
    }
    if (images.length === 1 && (window.innerWidth / 16) > 50){
      height = `calc(100vh - 20rem)`
    }
    // const width = this.calculateWidth(); // Call your function to calculate width
    let retruObj = { 'width': `calc(${width}% - 10px` };
    if(height){
      retruObj[`height`]=`${height}`;
    }
    return retruObj
  }

  getImageTagStyle(images){
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

  getIndividualNews = (news) => {
    try {
      this.router.navigate(['/view-news', news['newsId']]);
    } catch (error) {
      console.error(error)
    }
  }
}
