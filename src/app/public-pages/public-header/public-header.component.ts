import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppServiceService } from 'app/services/app-service.service';
import { StorageService } from 'app/services/storage.service';
import { filter } from 'rxjs';
import { LOCALE_ID } from '@angular/core';
import { CommonFunctionalityService } from 'app/services/common-functionality.service';


@Component({
  selector: 'public-header',
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.scss']
})
export class PublicHeaderComponent implements OnInit {

  public categoires: any = [];
  public ipCount: any = 0;
  public showMenu: boolean = false;
  public activeRoute: any = '';
  public selectedLanguage: any;
  public statesData: any = []

  public languageList = [
    {
      // "imageName": require('./../assets/languageImages/telugu.jpg'),
      "color": "#000B49",
      "name": "English",
      "nativeName": "English",
      "code": "en",
      'letter': "A"
    },
    {
      // "imageName": require('./../assets/languageImages/telugu.jpg'),
      "color": "#FF6969",
      "name": "Telugu",
      "nativeName": "తెలుగు",
      "code": "te",

      letter: "అ"
    }
  ];


  constructor(public appService: AppServiceService, private router: Router, public storage: StorageService, public translate: TranslateService, public commonFunctionality: CommonFunctionalityService) {
    // console.log("LANGUAGE", translate.currentLang)
    let value = this.storage.api.local.getValue('userLanguage')
    if (!value) {
      value = "te"
      this.storage.api.local.saveValue('userLanguage', value)
    }
    this.selectedLanguage = value
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // console.log('Route changed:', event.url);
      {
        if (event.url.split('/').length > 1) {
          this.activeRoute = event.url.split('/').at(-1);
          console.log(this.activeRoute)
        } else {
          this.activeRoute = '';
          // console.log(activeRoute)
        }
      }
    });
  }
  ngOnInit(): void {

    this.getListOfNewsCategories();
  }

  getListOfNewsCategories = () => {
    try {
      this.appService.loaderService = true;
      this.appService.getMetaData({ metaList: ['NEWS_CATEGORIES_REGIONAL', 'NEWS_TYPE_REGIONAL', 'STATES'] }).subscribe((data: any) => {
        if (data?.status === 'success') {
          this.categoires = data?.data?.NEWS_CATEGORIES_REGIONAL || [];
          let newAdditional = data?.data?.NEWS_TYPE_REGIONAL || [];
          newAdditional.shift();
          newAdditional.forEach(element => {
            element['newsType'] = true
          });
          this.categoires = [...this.categoires, ...newAdditional || []];
          this.statesData = data?.data?.STATES || [];

          this.getDistricts(this.statesData)

          // this.ipCount = data?.data?.viewersIp.length || 0;
        }
        this.appService.loaderService = false;
      }, (error) => {
        console.error(error)
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;

    }
  }
  getDistricts = (statesdata = []) => {
    try {
      this.appService.loaderService = true;

      let statesList = [];

      for (let index = 0; index < statesdata.length; index++) {
        statesList.push(statesdata[index]['value'] + '_DISTRICTS')

      }

      this.appService.getMetaData({ metaList: statesList }).subscribe((data: any) => {
        if (data?.status === 'success') {

          for (let index = 0; index < statesdata.length; index++) {
            if (data?.data?.[statesdata[index]['value'] + '_DISTRICTS']) {
              this.statesData[index]['DISTRICTS'] = data?.data?.[statesdata[index]['value'] + '_DISTRICTS']
            }
          }
          console.log(this.statesData)
          // this.statesData = data?.data?.STATES || [];


          // this.ipCount = data?.data?.viewersIp.length || 0;
        }
        this.appService.loaderService = false;
      }, (error) => {
        console.error(error)
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;

    }
  }
  onClickOfMore = (cat) => {
    this.appService.navigateTo({ type: 'category', queryParams: this.commonFunctionality.encodingURI(JSON.stringify(cat)) });
  }

  onClickOfDistrict = (state, district) => {
    let { DISTRICTS, ...stateData } = state;

    let param = { state: stateData, district }

    this.router.navigate(['/dn', this.commonFunctionality.encodingURI(JSON.stringify(param))]);

    console.log(stateData, district)
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  };


  onLanguageClick = (element) => {
    this.translate.use(element.code)
    this.storage.api.local.saveValue('userLanguage', element.code);
    this.selectedLanguage = element.code;


  }

}
