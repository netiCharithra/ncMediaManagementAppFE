import { Component, NgModule, OnInit } from '@angular/core';
import { AppServiceService } from '../../services/app-service.service';
import { AlertService } from '../../services/alert.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../config/config';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CommonFunctionalityService } from '../../services/common-functionality.service';

@Component({
  selector: 'nc-web-management-news-management',
  // standalone:true,
  // imports:[ CommonModule,
  //   FormsModule ],
  templateUrl: './management-news-management.component.html',
  styleUrl: './management-news-management.component.scss'
})
export class ManagementNewsManagementComponent implements OnInit {

  public employeesList: any = []


  public pendingNewsData: any = {
    header: [],
    body: [],
    totalNumberOfRecords: null,
    count: 10,
    page: 1,
    tableLoaded: false
  }

  public approvedNewsData: any = {
    header: [],
    body: [],
    totalNumberOfRecords: null,
    count: 10,
    page: 1,
    tableLoaded: false
  }
  public rejectedNewsData: any = {
    header: [],
    body: [],
    totalNumberOfRecords: null,
    count: 10,
    page: 1,
    tableLoaded: false
  }


  constructor(private appService: AppServiceService, private alertService: AlertService, private storage: StorageService, private http: HttpClient, private commonFunctionality: CommonFunctionalityService, private _activatedRoute: ActivatedRoute) {
    this.loggedUserDetails = this.storage.api.session.get('userData');
    _activatedRoute.queryParams.subscribe(
      params => {
        console.log('queryParams', params)


        if (params?.['newsAdd'].toString() == 'true') {
          console.log("SSS");

          setTimeout(() => {

            this.actionEmitterPendingNews({
              type: 'create'
            })
          }, 500);
        }
      });

  }

  ngOnInit(): void {
    this.getMetaData();
    // this.loadData();
    this.getNewsList();
  }


  fetchPendingNewsList = () => {
    try {
      // this.pageData=null;
      let payload = {}
      this.appService.loaderService = true;
      this.appService.fetchPendingNewsList(this.pendingNewsData).subscribe((response) => {
        if (response.status === 'success') {
          if (response.data) {

            console.log(response)
            this.pendingNewsData.tableLoaded = true;
            this.pendingNewsData.header = response?.data?.notApprovedNews?.tableData?.headerContent || []
            this.pendingNewsData.body = response?.data?.notApprovedNews?.tableData?.bodyContent || []
            this.pendingNewsData.metaData = response?.data?.notApprovedNews?.metaData || []
            this.pendingNewsData.totalNumberOfRecords = response?.data?.totalRecords || []

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


  fetchApprovedNewsList = () => {
    try {
      // this.pageData=null;
      this.appService.loaderService = true;
      this.appService.fetchApprovedNewsList(this.approvedNewsData).subscribe((response) => {
        if (response.status === 'success') {
          if (response.data) {

            console.log(response)
            this.approvedNewsData.tableLoaded = true;
            this.approvedNewsData.header = response?.data?.approvedNews?.tableData?.headerContent || []
            this.approvedNewsData.body = response?.data?.approvedNews?.tableData?.bodyContent || []
            this.approvedNewsData.metaData = response?.data?.approvedNews?.metaData || []
            this.approvedNewsData.totalNumberOfRecords = response?.data?.totalRecords || []

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
  fetchRejectedNewsList = () => {
    try {
      // this.pageData=null;
      this.appService.loaderService = true;
      this.appService.fetchRejectedNewsList(this.rejectedNewsData).subscribe((response) => {
        if (response.status === 'success') {
          if (response.data) {

            console.log(response)
            this.rejectedNewsData.tableLoaded = true;
            this.rejectedNewsData.header = response?.data?.rejectedNews?.tableData?.headerContent || []
            this.rejectedNewsData.body = response?.data?.rejectedNews?.tableData?.bodyContent || []
            this.rejectedNewsData.metaData = response?.data?.rejectedNews?.metaData || []
            this.rejectedNewsData.totalNumberOfRecords = response?.data?.totalRecords || []

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

  onPageChangePendingNews(page: number): void {
    this.pendingNewsData.page = page;
    this.fetchPendingNewsList();
  }
  onPageChangeApprovedNews(page: number): void {
    this.approvedNewsData.page = page;
    this.fetchApprovedNewsList();
  }
  onPageChangeRejectedNews(page: number): void {
    this.rejectedNewsData.page = page;
    this.fetchRejectedNewsList();
  }


  getNewsList = () => {
    this.fetchPendingNewsList();

  }




  public actionType: any = '';
  public disableFields: boolean = true;
  public publishNewsForm: any = {};
  public metaData: any = {};
  public uploadOnlineTempURL: any = '';
  public images: any = '';
  public loggedUserDetails: any = {};

  openImageUpload() {

    if (this.publishNewsForm['images'] && this.publishNewsForm['images'].length > 3) {
      // alert("You have reached maximum limit of images!");
      this.alertService.open('error', "Limit Reached", "Maximum 3 files can be uploaded !")
      return;

    } else {
      this.uploadOnlineTempURL = '';
      document.getElementById('myModalBtn')?.click()

      // document.getElementById('loginimages').click()
    }
  }

  removeImage = (index: any, imageInfo: any) => {
    console.log('imageInfo', imageInfo)

    if (this.publishNewsForm['images'][index]['externalURL']) {
      this.publishNewsForm['images'].splice(index, 1)
    } else {

      this.appService.deleteS3Images(imageInfo).subscribe(
        (response: any) => {
          if (response.status === "success") {
            this.publishNewsForm['images'].splice(index, 1)
          } else {
            this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
          }
          this.appService.loaderService = false;
        },
        (error) => {
          this.appService.loaderService = false;
          console.error('Upload error:', error);
        });
    }
  }
  getNewsInfo = (data: any) => {
    try {
      this.appService.loaderService = true;
      this.appService.getNewsInfo(data).subscribe((response) => {
        if (response.status === 'success') {
          this.publishNewsForm = response['data'] || {};
          this.publishNewsForm['initalDataCopy'] = JSON.parse(JSON.stringify(this.publishNewsForm))
          if(!this.publishNewsForm['priorityIndex']){
            this.publishNewsForm['priorityIndex'] = false
          }
          document.getElementById('publishNewsBtn')?.click();
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error)
      this.appService.loaderService = false;
    }
  }

  getMetaData = (stateId?: any, callFurtercalls?: any, eventRowData?: any) => {
    try {
      this.appService.loaderService = true;
      // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
      const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS'] : ['NEWS_CATEGORIES', 'STATES', 'ROLE', 'NEWS_TYPE', 'NEWS_SOURCES']
      this.appService.getMetaData({ metaList }).subscribe((response) => {
        this.metaData = { ...this.metaData, ...response['data'] || {} }
        console.log(this.metaData)
        if (callFurtercalls) {
          const index = this.metaData['STATES'].findIndex((elem: any) => elem.label === eventRowData['rowData'].state)
          if (index > -1) {
            this.getMetaData(this.metaData['STATES'][index]['value'], false, eventRowData);
          } else {
            this.getNewsInfo(eventRowData['rowData']);
          }
        } else if (!callFurtercalls && eventRowData) {
          this.getNewsInfo(eventRowData['rowData']);
        }
        this.appService.loaderService = false;
        this.appService.loaderService = false;
      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }

  changeOfCheckBoxPriority(event:any){
console.log(event)
  }
  signUpCreds = () => {
    this.appService.loaderService = true;
    try {
      let payload = this.publishNewsForm;

      if (this.loggedUserDetails['role'] === 'CEO' && payload['reportedBy']) {
        let reportedBy = {
          name: payload['reportedBy']['name'],
          profilePicture: payload['reportedBy']['profilePicture'],
          role: payload['reportedBy']['role'],
          employeeId: payload['reportedBy']['employeeId']
        }
        payload['reportedBy'] = reportedBy
      }

      if(this.actionType === 'approve'){
        // payload['approvedOn'] = new Date() 
      }
      console.log(payload)
      this.appService.manipulateNews({ type: this.actionType, data: payload }).subscribe((response) => {
        if (response.status === 'success') {
          this.alertService.open("success", "Success", response.msg || " ");
          document.getElementById('publishNewsBtn')?.click();
          this.getNewsList();
          this.publishNewsForm={}
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }

  changeOfState = () => {
    try {
      this.metaData[this.publishNewsForm['state'] + '_DISTRICTS'] = [];
      this.metaData[this.publishNewsForm['state'] + '_DISTRICT_MANDALS'] = [];
      this.getMetaData(this.publishNewsForm['state'])
    } catch (error) {
      console.error(error)
    }
  }

  actionEmitterPendingNews = (event: any) => {
    try {



      this.disableFields = false;
      this.actionType = event.type;
      this.publishNewsForm = {};
      if (event.type === 'create') {
        this.disableFields = false;
        // this.getMetaData();
        document.getElementById('publishNewsBtn')?.click();
      } else if (event.type === 'approve') {
        this.actionType = event.type;
        this.getMetaData(null, true, event);
        this.disableFields = true;
        // this.getNewsInfo(event);      
      } else if (event.type === 'reject') {
        this.actionType = event.type;
        this.getMetaData(null, true, event);
        this.disableFields = true;
        // this.getNewsInfo(event);      
      } else if (event.type === 'update') {
        this.actionType = event.type;
        this.getMetaData(null, true, event);
        this.disableFields = false;
        // this.getNewsInfo(event);      
      } else if (event.type === 'view') {
        alert(":AA")
        this.actionType = event.type;
        this.getMetaData(null, true, event);
        this.disableFields = true;
      } else if (event.type === 'headerActionSelect') {
        console.log(event);
        // this.automaticNewsType = event.value;
        // this.router.navigate(['/app/news', this.automaticNewsType]);
        // document.getElementById('autoNewsFetchLinkBtn').click();
      }
    } catch (error) {
      console.error(error)
    }
  }


  imgResultBeforeCompression: string = "";
  imgResultAfterCompression: string = "";
  upload(event: any) {
    const files = event.target.files;
    if (this.publishNewsForm['images'] && this.publishNewsForm['images'].length > 3) {
      this.alertService.open('error', "Limit Reached", "Maximum 3 files can be uploaded !")
      return;
    }
    if ((this.publishNewsForm?.images && this.publishNewsForm['images'].length + files.length) > 3) {
      this.alertService.open('error', "Limit Issue", this.publishNewsForm['images'].length + " file(s) already uploaded.. Only " + (3 - this.publishNewsForm['images'].length) + ' image(s) are allowed..');
      return;
    } else if (files.length > 3) {
      this.alertService.open('error', "Limit Reached", "Maximum 3 files can be uploaded !")
      return;
    }


    this.appService.loaderService = true;
    let selectedFiles: File[] = [];
    let userData = this.storage.api.session.get('userData')
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      selectedFiles.push(files.item(i));
      formData.append('images', files.item(i), userData.employeeId + '_' + new Date().getTime() + '_' + i);
    }

    formData.append('fileName', "original")

    this.http.post(Config.API.UPLOAD_FILES, formData).subscribe(
      (response: any) => {
        if (response.status === "success") {
          if (!this.publishNewsForm['images']) {
            this.publishNewsForm['images'] = [];
          }
          response.data.forEach((element: any) => {
            this.publishNewsForm['images'].push(element)
          });
          // this.publishNewsForm['images'] = [...response.data, this.publishNewsForm['images']]
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      },
      (error) => {
        this.appService.loaderService = false;
        console.error('Upload error:', error);
      });

      // document.getElementById('publishNewsBtn')?.click();


  }


  onTabChange = (event: any) => {
    console.log(event)
    if (event === 0) {

      this.pendingNewsData.page = 1;
      this.fetchPendingNewsList();
      // Call pending news
    }
    if (event === 1) {

      this.approvedNewsData.page = 1;
      this.fetchApprovedNewsList()
      // Call Approved News
    }
    if (event === 2) {
      // Call Rejected News
      this.onPageChangeRejectedNews(1)
    }
  }
  openUploadImageLocal = () => {
    document.getElementById('myModalBtn')?.click()
    document.getElementById('publishNewsBtn')?.click();
    setTimeout(() => {
      document.getElementById('loginimages')?.click()
      
    }, 500);

  }

  addImageURL = async () => {
    if (!this.uploadOnlineTempURL) {
      this.alertService.open('error', "IMAGE URL NEEDED", "ERROR !")

      return
    }
    this.commonFunctionality.checkImage(this.uploadOnlineTempURL).subscribe(result => {
      if (result) {
        if (!Array.isArray(this.publishNewsForm['images'])) {
          this.publishNewsForm['images'] = [];
        }

        this.publishNewsForm['images'].push({ externalURL: this.uploadOnlineTempURL });

        document.getElementById('myModalBtn')?.click()
        document.getElementById('publishNewsBtn')?.click()

      } else {
        this.alertService.open('error', "Invalid Image URL", "Invalid Image")
      }
    });
  }

}

// fetchPendingNewsList
