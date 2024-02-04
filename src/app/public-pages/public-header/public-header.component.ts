import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppServiceService } from 'app/services/app-service.service';
import { filter } from 'rxjs';

@Component({
  selector: 'public-header',
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.scss']
})
export class PublicHeaderComponent implements OnInit {

  public categoires: any = [];
  public ipCount: any = 0;
  public showMenu:boolean=false;

  public activeRoute:any=''
  constructor(public appService: AppServiceService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('Route changed:', event.url);{
        if (event.url.split('/').length>1){
          this.activeRoute = event.url.split('/')[1];
          console.log(this.activeRoute)
        } else {
          this.activeRoute = '';
        }
      }
    }); }
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

  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  };

}
