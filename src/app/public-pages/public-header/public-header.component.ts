import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceService } from 'app/services/app-service.service';

@Component({
  selector: 'public-header',
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.scss']
})
export class PublicHeaderComponent implements OnInit {

  public categoires: any = [];
  public ipCount: any = 0;
  constructor(public appService: AppServiceService, private router: Router) { }
  ngOnInit(): void {
    this.getListOfNewsCategories();
  }

  getListOfNewsCategories = () => {
    try {
      this.appService.loaderService = true;
      this.appService.getMetaData({ metaList: ['NEWS_CATEGORIES', 'viewersIp'] }).subscribe((data: any) => {
        if (data?.status === 'success') {
          this.categoires = data?.data?.NEWS_CATEGORIES || [];
          this.ipCount = data?.data?.viewersIp.length || 0;
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

  

}
