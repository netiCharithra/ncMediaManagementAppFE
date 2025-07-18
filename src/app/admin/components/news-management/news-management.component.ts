import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { StorageService } from '../../services/storage.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { environment } from '../../../../environments/environment';
import { LanguageService } from '../../../services/language.service'; 
import { CommonFunctionalityService } from '../../services/common-functionality.service';
declare var bootstrap: any;

@Component({
  selector: 'app-news-management',
  templateUrl: './news-management.component.html',
  styleUrls: ['./news-management.component.scss']
})

export class NewsManagementComponent implements OnInit {
  @ViewChild('newsForm') newsForm: any;

  public employeesList: any = [];
  public selectedTab: number = 0;
  public newsCategories = ['pending', 'approved', 'rejected'];

  public newsData: any = {
    header: [],
    body: [],
    totalNumberOfRecords: null,
    count: 10,
    page: 1,
    tableLoaded: false
  };

  public actionType: any = '';
  public disableFields: boolean = true;
  public publishNewsForm: any = {};
  public metaData: any = {};
  public uploadOnlineTempURL: any = '';
  public images: any = '';
  public loggedUserDetails: any = {};
  public showLoader: boolean = false;

  constructor(
    private appService: AdminService, 
    private messageService: MessageService, 
    private storage: StorageService, 
    private http: HttpClient, 
    private _activatedRoute: ActivatedRoute,
    public languageService: LanguageService ,
    public commonFunctionality:CommonFunctionalityService
  ) {
    this.loggedUserDetails = this.storage.getStoredUser();
    console.log("loggedUserDetails", this.loggedUserDetails);
   this.newsData['employeeId']=this.loggedUserDetails?.employeeId;
   this.newsData['role']=this.loggedUserDetails?.role;
    _activatedRoute.queryParams.subscribe(
      params => {
        console.log('queryParams', params);

        if (params?.['newsAdd']?.toString() === 'true') {
          console.log("SSS");

          setTimeout(() => {
            this.actionEmitterPendingNews({
              type: 'create'
            });
          }, 500);
        }
      });
  }

  ngOnInit(): void {
    this.getMetaData();
    this.fetchNewsList();
  }

  ngAfterViewInit() {
    if (this.newsForm) {
      this.newsForm.form.updateValueAndValidity();
    }
  }
  getNewsActiveEmployees = (data: any) => {
    try {
      console.log("ac",data)
      if(data?.label !== 'Neti Charithra'){
        return
      }
      const payload={
        employeeId:this.loggedUserDetails?.employeeId,
        role:this.loggedUserDetails?.role
      }
      this.appService.loaderService = true;
      this.appService.fetchNewsActiveEmployees(payload).subscribe((response) => {
        console.log('empResp',response)
        this.employeesList = response || [];
        this.appService.loaderService = false;
      });
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;
    }
  };
  fetchNewsList = () => {
    const category = this.newsCategories[this.selectedTab];
    
    try {
      this.showLoader = true;
      
      let fetchMethod;
      switch(category) {
        case 'pending':
          fetchMethod = this.appService.fetchPendingNewsList(this.newsData);
          break;
        case 'approved':
          fetchMethod = this.appService.fetchApprovedNewsList(this.newsData);
          break;
        case 'rejected':
          fetchMethod = this.appService.fetchRejectedNewsList(this.newsData);
          break;
        default:
          fetchMethod = this.appService.fetchPendingNewsList(this.newsData);
      }
      
      fetchMethod.subscribe((response:any) => {
        console.log("RESPONSE",response)
        if(response){
          
          this.newsData.tableLoaded = true;
            
          // Map the response data based on the selected category
          const dataKey = category === 'pending' ? 'notApprovedNews' : 
                         (category === 'approved' ? 'approvedNews' : 'rejectedNews');
          console.log("DATAA",dataKey,category)
          this.newsData.header = response?.[dataKey]?.tableData?.headerContent || [];
          this.newsData.body = response?.[dataKey]?.tableData?.bodyContent || [];
          this.newsData.metaData = response?.[dataKey]?.metaData || [];
          this.newsData.totalNumberOfRecords = response?.totalRecords || [];
        } else {
          this.messageService.showError(response.msg || "Failed!");
        }
        this.showLoader = false;
      }, (error:any) => {
        console.error(error);
        this.showLoader = false;
      });
    } catch (error:any) {
      this.showLoader = false;
      console.error(error);
    }
  };

  onPageChange(page: number): void {
    this.newsData.page = page;
    this.fetchNewsList();
  }

  openImageUploadModal(): void {
    if (!this.disableFields) {
      const modal = new bootstrap.Modal(document.getElementById('myModal'));
      modal.show();
    }
  }

  removeImage(index: number, image: any): void {
    this.publishNewsForm['images'].splice(index, 1);
    // If array is empty after removal, initialize it as empty array to maintain type
    if (this.publishNewsForm['images'].length === 0) {
      this.publishNewsForm['images'] = [];
    }
  }
  
  getNewsInfo = (data: any) => {
    try {
      this.appService.loaderService = true;
      this.appService.getNewsInfo(data).subscribe((response) => {
        if (response) {
          this.publishNewsForm = response ? { ...response } : {};
          this.publishNewsForm['initalDataCopy'] = JSON.parse(JSON.stringify(this.publishNewsForm));
          if(!this.publishNewsForm['priorityIndex']){
            this.publishNewsForm['priorityIndex'] = false;
          }
          
          // Add a small delay to ensure the form is properly initialized
          setTimeout(() => {
            const modal = new bootstrap.Modal(document.getElementById('addEmployee'));
            modal.show();
            this.updateFormState();
          }, 100);
        } else {
          this.messageService.showError(response.msg || "Failed!");
        }
        this.appService.loaderService = false;
      });
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;
    }
  };

  updateFormState() {
    if (this.newsForm) {
      // Force form to update its state
      Object.keys(this.newsForm.form.controls).forEach(key => {
        const control = this.newsForm.form.get(key);
        if (control) {
          if (this.disableFields) {
            // When fields are disabled, mark them as touched and valid
            control.markAsTouched();
            control.markAsPristine();
            control.updateValueAndValidity();
          } else {
            // When fields are enabled, update their validity normally
            control.updateValueAndValidity();
          }
        }
      });
      this.newsForm.form.updateValueAndValidity();
    }
  }


  getMetaData = (stateId?: any, callFurtercalls?: any, eventRowData?: any) => {
    try {
      this.appService.loaderService = true;
      // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
      console.log('hi')
      const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS'] : ['NEWS_CATEGORIES', 'STATES', 'ROLE', 'NEWS_TYPE', 'NEWS_SOURCES'];
      console.log("metaList", metaList)
      this.appService.getMetaData({ metaList }).subscribe((response) => {
        this.metaData = { ...this.metaData, ...response || {} };
        console.log(this.metaData);
        if (callFurtercalls) {
          const index = this.metaData['STATES'].findIndex((elem: any) => elem.label === eventRowData['rowData'].state);
          if (index > -1) {
            this.getMetaData(this.metaData['STATES'][index]['value'], false, eventRowData);
          } else {
            this.getNewsInfo(eventRowData['rowData']);
          }
        } else if (!callFurtercalls && eventRowData) {
          this.getNewsInfo(eventRowData['rowData']);
        }
        this.appService.loaderService = false;
      });
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error);
    }
  };

  changeOfCheckBoxPriority(event:any){
    console.log(event);
  }
  logForm(form: any) {
    console.log('Form:', form);
    for (const key in form.controls) {
      const control = form.controls[key];
      console.log(`${key}:`, control.errors);
    }
  }
  signUpCreds = () => {
    if (this.newsForm && !this.newsForm.form.valid) {
      console.log('Form is invalid:', this.newsForm.form.errors);
      return;
    }
    this.appService.loaderService = true;
    try {
      let payload = this.publishNewsForm;

      if (this.loggedUserDetails?.role === 'CEO' && payload['reportedBy']) {
        let reportedBy = {
          name: payload['reportedBy']['name'],
          profilePicture: payload['reportedBy']['profilePicture'],
          role: payload['reportedBy']['role'],
          employeeId: payload['reportedBy']['employeeId']
        };
        payload['reportedBy'] = reportedBy;
      }

      if(this.actionType === 'approve'){
        // payload['approvedOn'] = new Date() 
      }
      console.log(payload);
      this.appService.manipulateNews({ type: this.actionType, data: payload }).subscribe((response) => {
        if (response) {
          this.messageService.showInfo(
            this.languageService.getString(
              this.actionType === 'create' ? 'newsCreatedSuccess' :
              this.actionType === 'update' ? 'newsUpdatedSuccess' :
              this.actionType === 'approve' ? 'newsApprovedSuccess' :
              'newsRejectedSuccess'
            )
          );
          document.getElementById('manipulateNewsCloseBtn')?.click();
          this.fetchNewsList();
          this.publishNewsForm = {};
        } else {
          this.messageService.showError(response.msg || "Failed!");
        }
        this.appService.loaderService = false;
      });
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error);
    }
  };

  changeOfState = () => {
    try {
      this.metaData[this.publishNewsForm['state'] + '_DISTRICTS'] = [];
      this.metaData[this.publishNewsForm['state'] + '_DISTRICT_MANDALS'] = [];
      this.getMetaData(this.publishNewsForm['state']);
    } catch (error) {
      console.error(error);
    }
  };

  actionEmitterPendingNews = (event: any) => {
    try {
      this.disableFields = false;
      this.actionType = event.type;
      this.publishNewsForm = {};
      if (event.type === 'create') {
        this.disableFields = false;
        this.openImageUploadModal();
      } else if (event.type === 'approve') {
        this.actionType = event.type;
        this.getMetaData(null, true, event);
        this.disableFields = true;
        setTimeout(() => this.updateFormState(), 100);
      } else if (event.type === 'reject') {
        this.actionType = event.type;
        this.getMetaData(null, true, event);
        this.disableFields = true;
        setTimeout(() => this.updateFormState(), 100);
      } else if (event.type === 'update') {
        this.actionType = event.type;
        this.getMetaData(null, true, event);
        this.disableFields = false;
      } else if (event.type === 'view') {
        this.actionType = event.type;
        this.getMetaData(null, true, event);
        this.disableFields = true;
        setTimeout(() => this.updateFormState(), 100);
      } else if (event.type === 'headerActionSelect') {
        console.log(event);
      }
    } catch (error) {
      console.error(error);
    }
  };

  imgResultBeforeCompression: string = "";
  imgResultAfterCompression: string = "";
  upload(event: any) {
    const files = event.target.files;
    if (this.publishNewsForm['images'] && this.publishNewsForm['images'].length > 3) {
      this.messageService.showError("Maximum 3 files can be uploaded!");
      return;
    }
    if ((this.publishNewsForm?.images && this.publishNewsForm['images'].length + files.length) > 3) {
      this.messageService.showError(this.publishNewsForm['images'].length + " file(s) already uploaded.. Only " + (3 - this.publishNewsForm['images'].length) + ' image(s) are allowed..');
      return;
    } else if (files.length > 3) {
      this.messageService.showError("Maximum 3 files can be uploaded!");
      return;
    }

    this.showLoader = true;
    let selectedFiles: File[] = [];
    let userData = this.loggedUserDetails;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      selectedFiles.push(files.item(i));
      formData.append('images', files.item(i), userData?.employeeId + '_' + new Date().getTime() + '_' + i);
    }

    formData.append('fileName', "original");

    this.appService.uploadNewsImages(formData).subscribe(
      (response: any) => {
        if (response.status === "success") {
          if (!this.publishNewsForm['images']) {
            this.publishNewsForm['images'] = [];
          }
          response.data.forEach((element: any) => {
            this.publishNewsForm['images'].push(element);
          });
        } else {
          this.messageService.showError(response.msg || "Failed!");
        }
        this.showLoader = false;
      },
      (error) => {
        this.showLoader = false;
        console.error('Upload error:', error);
      });
  }

  onTabChange = (index: number) => {
    this.selectedTab = index;
    this.newsData.page = 1;
    this.fetchNewsList();
  };

  getNoRecordsMessage(): string {
    const category = this.newsCategories[this.selectedTab];
    const currentLang = this.languageService.getCurrentLanguage();
    return currentLang === 'te' ? 
      `${category === 'pending' ? 'పెండింగ్' : category === 'approved' ? 'ఆమోదించబడిన' : 'తిరస్కరించబడిన'} వార్తలు ఏవీ లేవు` :
      `No ${category} news found`;
  }

  openUploadImageLocal = () => {
    document.getElementById('loginimages')?.click();
  };

  
  addImageURL = async () => {
    if (!this.uploadOnlineTempURL) {
      this.messageService.showError("IMAGE URL NEEDED");
      return;
    }
   
    this.commonFunctionality.checkImage(this.uploadOnlineTempURL).subscribe(result => {
      console.log(result,"ASSA");
      if (result) {
        if (!Array.isArray(this.publishNewsForm['images'])) {
          this.publishNewsForm['images'] = [];
        }

        this.publishNewsForm['images'].push({ externalURL: this.uploadOnlineTempURL });
        const modalElement = document.getElementById('myModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }
      } else {
        console.log("Invalid Image URL")
        this.messageService.showError("Invalid Image URL");
      }
    });
  };

  openReportNewsModal(): void {
    this.actionType = 'create';
    this.disableFields = false;
    this.publishNewsForm = {
      title: '',
      sub_title: '',
      description: '',
      sourceLink: '',
      images: [],
      newsType: null,
      category: null,
      source: this.loggedUserDetails?.role === 'REPORTER' ? 'Neti Charithra' : null,
      reportedBy: this.loggedUserDetails
    };
    const modal = new bootstrap.Modal(document.getElementById('addEmployee'));
    modal.show();
  }
  
}
