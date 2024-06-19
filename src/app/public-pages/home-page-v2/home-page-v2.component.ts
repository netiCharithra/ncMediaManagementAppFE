import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';
import { StorageService } from 'app/services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'home-page-v2',
  templateUrl: './home-page-v2.component.html',
  styleUrls: ['./home-page-v2.component.scss']
})
export class HomePageV2Component implements OnInit, OnChanges {


  public metaData: any = {};
  public topSectionData: any = [];
  public categoryWiseRecentRecords: any = [];
  public moreRecentRecords: any = [];
  public userLanguage: any;

  public homeDataV2: any = {};
  public homeDataV2NewsType: any = {};
  public homeDataV2CategoryWise: any = {};
  public cards = [
    { title: 'Animals get boost from Southampton tree vandals', time: '15 minutes ago' },
    // Add more cards here
    { title: 'Title 2', time: '20 minutes ago' },
    { title: 'Title 3', time: '25 minutes ago' },
    { title: 'Title 4', time: '30 minutes ago' },
    { title: 'Title 5', time: '35 minutes ago' },
  ];

  images = [
    { src: 'https://via.placeholder.com/900x300?text=First+Slide', alt: 'First Slide' },
    { src: 'https://via.placeholder.com/900x300?text=Second+Slide', alt: 'Second Slide' },
    { src: 'https://via.placeholder.com/900x300?text=Third+Slide', alt: 'Third Slide' }
  ];
  public paramMapSubscription: Subscription;
  public queryParamSubscription: Subscription;
  constructor(private sanitizer: DomSanitizer, public appService: AppServiceService, private alertService: AlertService, private router: Router, private route: ActivatedRoute, public storage: StorageService, public translate: TranslateService) {
    let value = this.storage.api.local.getValue('userLanguage')
    if (!value) {
      value = "te"
      this.storage.api.local.saveValue('userLanguage', value)
    }
    this.userLanguage = value
    this.queryParamSubscription = this.route.queryParamMap.subscribe((queryParams) => {
      const queryParamValue = queryParams.get('yourQueryParamName'); // Replace with your actual query param name
      console.log('Query parameter changed:', queryParamValue);
    });
  }

  ngOnInit(): void {
    this.getMetaData();
    this.getHomeDataNewsType();

  }
  getSafeImageUrl(fileId: string): SafeResourceUrl {
    const url = `https://drive.google.com/uc?export=view&id=${fileId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  getHomeData = () => {
    try {
      this.appService.getHomeData({}).subscribe((response) => {
        if (response.status === 'success') {

          this.homeDataV2 = response?.data?.[0] || [];
          this.alertService.open("success", "Success", response.msg || " ");
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      }, (error) => {
        console.error(error);
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;
    }
  }
  getHomeDataNewsType = () => {
    try {
      this.appService.getHomeDataNewsType({}).subscribe((response) => {
        if (response.status === 'success') {

          this.homeDataV2NewsType = response?.data?.[0]?.['types'] || [];
          // this.alertService.open("success", "Success", response.msg || " ");
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      }, (error) => {
        console.error(error);
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;
    }
  }
  getHomeDataCategoryWise = () => {
    try {
      this.appService.getHomeDataCategoryWise({}).subscribe((response) => {
        if (response.status === 'success') {

          let data = response?.data || [];
          if (this?.metaData?.['NEWS_CATEGORIES_REGIONAL']?.length > 0)
            for (let index = 0; index < data.length; index++) {

              let ind = this.metaData?.['NEWS_CATEGORIES_REGIONAL'].findIndex((elem) => elem.label === data[index]['category']);
              if (ind > -1) {
                data[index]['category'] = this.metaData?.['NEWS_CATEGORIES_REGIONAL'][ind]
              }
            }
          this.homeDataV2CategoryWise = data || [];
          console.log("CAtegory", data)
          // this.alertService.open("success", "Success", response.msg || " ");
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      }, (error) => {
        console.error(error);
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;
    }
  }

  onClickOfMore = (cat) => {
    const jsonString = JSON.stringify(cat); // Step 1: Convert to JSON string

    const encoder = new TextEncoder();
    const byteArray = encoder.encode(jsonString); // Step 2: Convert JSON string to byte array
    const base64String = window.btoa(String.fromCharCode(...byteArray)); // Step 3: Encode byte array to base64

    this.appService.navigateTo({ type: 'category', queryParams: { category: base64String } });
  }


  getMetaData = () => {
    try {
      const metaList = ['NEWS_CATEGORIES_REGIONAL']

      this.appService.getMetaData({ metaList }).subscribe((response) => {
        if (response.status === 'success') {
          if (response.data) {
            this.metaData = { ...this.metaData, ...response.data }
          }
          // console.log(response)
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
        this.getHomeData();
        this.getHomeDataCategoryWise();
      }, (error) => {
        this.getHomeData();
        this.getHomeDataCategoryWise();
        console.error(error);
        this.appService.loaderService = false;
      })
    } catch (error) {
      this.getHomeData(); this.getHomeDataCategoryWise();

      console.error(error)
    }
  }

  onNewsClick = (newsInfo: any, category?: any) => {
    try {
      let queryParams = {
        newsId: newsInfo['newsId']
      };
      if (category) {
        queryParams['category'] = category;
      }

      // let queryStr = '?newsId=' + queryParams['newsId'] + '&category='+queryParams['category']
      // this.router.navigate(['/view-news' + queryStr]);
      this.router.navigate(['/view-news', newsInfo['newsId']]);
    } catch (error) {
      console.error(error)
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('Input data changed:', changes);
  }
}
