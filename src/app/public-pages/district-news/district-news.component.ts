import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';
import { CommonFunctionalityService } from 'app/services/common-functionality.service';
import { StorageService } from 'app/services/storage.service';
// import { Subscription } from 'rxjs';

@Component({
  selector: 'district-news',
  templateUrl: './district-news.component.html',
  styleUrls: ['./district-news.component.scss']
})
export class DistrictNewsComponent implements OnInit {
  public metaInformation: any = {};
  public userLanguage: any = 'te';

  public newsData: any = [];
  public initialLoad: boolean = true;
  public paginationNewsData: any = {
    count: 9,
    page: 0,
    endOfRecords: false
  }



  constructor(private commonFunctionality: CommonFunctionalityService, private router: Router, private route: ActivatedRoute, private appService: AppServiceService, private alertService: AlertService, private storage: StorageService
  ) {

    let value = this.storage.api.local.getValue('userLanguage')
    if (!value) {
      value = "te"
      this.storage.api.local.saveValue('userLanguage', value)
    }
    this.userLanguage = value

    console.log("change rote")

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.metaInformation = JSON.parse(this.commonFunctionality.decodingURI(params.get('id'))) || {}
      // Retrieve the parameter you're interested in

      this.initialLoad = true;
      this.paginationNewsData = {
        count: 9,
        page: 0,
        endOfRecords: false
      }
      this.getDistrictNews(true);
      // console.log("RPO", params.get('id'))
      // this.handleParamChange();
    });

    // this.route.paramMap.subscribe((params: Params) => {



    // })
  }

  ngOnInit(): void {

  }

  getDistrictNews = (initialLoad: any = false) => {
    try {
      let payload = {
        state: this.metaInformation?.state?.value,
        district: this.metaInformation?.district?.value
      }
      this.appService.getDistrictNews({ ...payload, ...this.paginationNewsData }).subscribe((response) => {
        if (response.status === 'success') {
          if (initialLoad) {
            this.newsData = response?.data || [];
          } else {
            this.newsData = [...this.newsData, ...response?.data || []]
          }
          this.paginationNewsData.page += 1;
          this.paginationNewsData.endOfRecords = response?.endOfRecords || false;
          this.initialLoad = false;
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

}
