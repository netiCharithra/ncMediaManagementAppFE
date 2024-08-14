import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionalityService } from '../../services/common-functionality.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'nc-web-manangement-screens-header',
  templateUrl: './manangement-screens-header.component.html',
  styleUrl: './manangement-screens-header.component.scss'
})
export class ManangementScreensHeaderComponent implements OnInit {

  public screenLoaded: any = '';
  public userDetails: any = '';
  constructor(public commonFucntion: CommonFunctionalityService, private route: ActivatedRoute, private router: Router, private storage: StorageService) {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        let url = event.urlAfterRedirects.split('/');

        console.log(url[2]);
        console.log('Route parameters changed:', url);
        this.screenLoaded = url.at(-1)?.split('?')[0]
        console.log('Route parameters changed:', this.screenLoaded);

        this.getUserDetails()
      }
      // Handle route change here
    });
  }

  ngOnInit(): void {
    this.getUserDetails();


    this.screenLoaded = (this.router.url.split('/').at(-1))?.split('?')[0];
    // console.log(this.screenLoaded, this.router.url.split('/').at(-1));
    // });
  }

  getUserDetails = async () => {
    const userData = await this.storage.api.session.get('userData');
    this.userDetails = userData;
    console.log("thi", this.userDetails)
  }
  callSidebarFunction() {
    this.commonFucntion.triggerSidebarFromHeader();
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '  assets/images/useravatar.avif';
  }

  addNewsEvent = () => {
    if(this.screenLoaded !== 'news-management'){
      this.router.navigate(['/admin/news-management'], { queryParams: { newsAdd: 'true' } });

    } else {
      document.getElementById('publishNewsBtn')?.click();

    }
  }
  addEmployeeEvent = () => {
    if(this.screenLoaded !== 'employee-management'){
      this.router.navigate(['/admin/employee-management'], { queryParams: { newsAdd: 'true' } });

    } else {
      document.getElementById('addEmployeeBtnBtn')?.click();

    }
  }
  addEmployeeTracing = () => {
    if(this.screenLoaded !== 'employee-tracing'){
      this.router.navigate(['/admin/employee-tracing'], { queryParams: { newsAdd: 'true' } });

    } else {
      document.getElementById('addEmployeeTracingBtnBtn')?.click();

    }
  }
}
