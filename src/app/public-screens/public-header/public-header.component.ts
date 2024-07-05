import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppServiceService } from '../../services/app-service.service';
import { CommonFunctionalityService } from '../../services/common-functionality.service';
import { StorageService } from '../../services/storage.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'nc-web-public-header',
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.scss'
})
export class PublicHeaderComponent implements OnInit{


  // TO BE REMOVED START

  public showMenu:boolean = false;
  public hideMenu:boolean = false;
  public activeRoute :any ='';
  // TO BE REMOVED END

  public selectedLanguage:any='';
  public categoires:any=[];
  public statesData:any=[];
  public languageList:any = [
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

  constructor(public translate: TranslateService, public appService:AppServiceService, public commonFunctionality:CommonFunctionalityService, private storage:StorageService, private router:Router){
    let value = this.storage.api.local.getValue('userLanguage')
    if (!value) {
      value = "te"
      this.storage.api.local.saveValue('userLanguage', value)
    }
    this.selectedLanguage = value
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event:any) => {
      // console.log('Route changed:', event.url);
      {
        if (event.url.split('/').length > 1) {
          this.activeRoute = event.url.split('/').at(-1);
          console.log("activeRoute",  )
          if(event.url.split('/')?.[1] === 'yourStatus'){
            this.hideMenu=true
          }
        
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
          newAdditional.forEach((element:any) => {
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
  onClickOfMore = (cat:any) => {
    this.appService.navigateTo({ type: 'category', queryParams: this.commonFunctionality.encodingURI(JSON.stringify(cat)) });
  }
  geToHelp = () => {
    this.appService.navigateTo({ type: 'help' });
  }

  onClickOfDistrict = (state:any, district:any) => {
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


  onLanguageClick = (element:any) => {
    this.translate.use(element.code)
    this.storage.api.local.saveValue('userLanguage', element.code);
    this.selectedLanguage = element.code;


  }

}
