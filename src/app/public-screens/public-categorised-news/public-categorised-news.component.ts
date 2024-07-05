import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppServiceService } from '../../services/app-service.service';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';
import { CommonFunctionalityService } from '../../services/common-functionality.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'nc-web-public-categorised-news',
  templateUrl: './public-categorised-news.component.html',
  styleUrl: './public-categorised-news.component.scss'
})
export class PublicCategorisedNewsComponent implements OnInit {

  public paramPayload: any = {};
  public paramValue: any;
  public pageData: any = {};
  public endOfRecords: boolean = false;

  public userLanguage: any = {};
  public metaInformation: any = {};
  public initialLoad: boolean = false;

  public paginationNewsData: any = {
    count: 9,
    page: 0,
    endOfRecords: false
  }
  constructor(private route: ActivatedRoute, public appService: AppServiceService, private alertService: AlertService, private router: Router, private storage: StorageService, public commonFunctionality: CommonFunctionalityService, private translate:TranslateService,  private titleService:Title) {


    let value = this.storage.api.local.getValue('userLanguage')
    if (!value) {
      value = "te"
      this.storage.api.local.saveValue('userLanguage', value)
    }
    this.userLanguage = value

    console.log("change rote")

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.metaInformation = JSON.parse(this.commonFunctionality.decodingURI(params.get('id'))) || {};
      this.translate.get('title').subscribe((translatedTitle: string) => {
        // console.log("translatedTitle", translatedTitle)
        this.titleService.setTitle(translatedTitle + ' | '+ this.metaInformation?.[this.userLanguage]+ ' వార్తలు' );
      });
      console.log(this.metaInformation)

      this.initialLoad = true;
      this.paginationNewsData = {
        count: 9,
        page: 0,
        endOfRecords: false
      }
      this.getNewsInfo(true)
      // Retrieve the parameter you're interested in

    });
  }

  ngOnInit(): void {
    // if (this.payload['category']) {
    //   this.getNewsInfo();
    // }
  }

  getNewsInfo = (initalLoad: any = false) => {
    try {
      this.appService.loaderService = true;

      let payload = this.metaInformation?.newsType ? { newsType: this.metaInformation?.value } : { category: this.metaInformation.label }


      // this.appService.getCategoryNews({ ...this.paginationNewsData, ...{ category: this.metaInformation.label } }).subscribe((response) => {
      this.appService[this.metaInformation?.newsType ? 'getPublicNewsNewsType' : 'getCategoryNews']({ ...this.paginationNewsData, ...payload }).subscribe((response) => {
        if (response.status === 'success') {
          if (response.data) {
            if (initalLoad) {
              this.pageData = (this.metaInformation?.newsType ? { records: response.data } : response.data) || {};
            } else {
              this.pageData['records'] = this.pageData['records'].concat((this.metaInformation?.newsType ? response?.data : response?.data?.records) || []);
              // this.pageData['recentRecords'] = response?.data?.recentRecords || [];
            }
            this.paginationNewsData['endOfRecords'] = this.metaInformation?.newsType ? response?.endOfRecords : response?.data?.endOfRecords;
            this.paginationNewsData['page'] = this.paginationNewsData['page'] + 1;
            // this.endOfRecords = response?.data?.endOfRecords;
            // if (!response?.data?.endOfRecords) {
            //   this.payload.page = this.payload.page + 1;
            // }
            console.log(this.pageData)
            this.initialLoad = false;
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

  getImageDivStyle(images:any) {

    let width = 100;
    let height;
    if ((window.innerWidth / 16) > 30 && images?.length) {
      width = 100 / images.length
    }
    if (images.length === 1 && (window.innerWidth / 16) > 50) {
      height = `calc(100vh - 20rem)`
    }
    // const width = this.calculateWidth(); // Call your function to calculate width
    let retruObj:any = { 'width': `calc(${width}% - 10px` };
    if (height) {
      retruObj[`height`] = `${height}`;
    }
    return retruObj
  }

  getImageTagStyle(images:any) {
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


  getIndividualNews = (news:any) => {
    try {
      this.router.navigate(['/view-news', news['newsId']]);
    } catch (error) {
      console.error(error)
    }
  }
}
