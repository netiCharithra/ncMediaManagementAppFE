import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppServiceService } from '../../services/app-service.service';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../config/config';

@Component({
  selector: 'nc-web-management-employee-management',
  templateUrl: './management-employee-management.component.html',
  styleUrl: './management-employee-management.component.scss'
})
export class ManagementEmployeeManagementComponent implements OnInit, AfterViewInit {

  @ViewChild('addEmployeeBtnBtn', { static: false }) addEmployeeBtnBtn!: ElementRef;

  public selectedCar: any = "Active";

  public employeeInfo: any = {};


  constructor(private appService: AppServiceService, private alertService: AlertService, private storage:StorageService, private router: Router, private http: HttpClient, private _activatedRoute: ActivatedRoute) {
    // _activatedRoute.queryParams.subscribe(
    //   params => {
    //     console.log('queryParams', params)


    //     if (params?.['newsAdd'].toString() == 'true') {
    //       console.log("SSS");

    //       setTimeout(() => {

    //         this.actionEmitter({
    //           type: 'create'
    //         })
    //       }, 500);
    //     }
    //   });


  }

  ngAfterViewInit(): void {

    this.addEmployeeBtnBtn.nativeElement.addEventListener('click', this.onAddEmployeeClick.bind(this));

  }
  onAddEmployeeClick(): void {
    console.log('Add Employee button clicked!');
    this.actionEmitter({
      type: 'create'
    })
    // Your logic here
  }


  ngOnInit(): void {

    this.fetchEmployeeList();
  }
  public newsActions = ["Active", "Inactive", "Disabled"];
  public employeeListData: any = {
    header: [],
    body: [],
    totalNumberOfRecords: null,
    count: 7,
    page: 1,
    tableLoaded: false,
    action: this.newsActions[0]
  }


  changeOfNewsType = () =>{
    try {
      this.employeeListData.page =1;

      this.fetchEmployeeList();
    } catch (error) {
      console.error(error)

    }
  }

  fetchEmployeeList = () => {
    try {
      // this.pageData=null;
      let payload = {}
      this.appService.loaderService = true;
      this.appService.fetchingEmployeeListV2(this.employeeListData).subscribe((response) => {
        if (response.status === 'success') {
          if (response.data) {

            console.log(response)
            this.employeeListData.tableLoaded = true;
            this.employeeListData.header = response?.data?.header || []
            this.employeeListData.body = response?.data?.['data'] || []
            this.employeeListData.metaData = response?.data?.metadata || []
            this.employeeListData.totalNumberOfRecords = response?.data?.metadata?.[0]?.['total'] || []
            console.log(this.employeeListData)

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
  public signUpFormValues: any = {};
  public metaData: any = {
    "ROLE": [],
    "STATES": []
  };
  public actionType: any = '';
  public disableFields: boolean = false;
  public identityVerificationRejectionReason: any;
  openImageUpload(key:any) {

    // if (this.publishNewsForm['images'] && this.publishNewsForm['images'].length > 3) {
    //   // alert("You have reached maximum limit of images!");
    //   this.alertService.open('error', "Limit Reached", "Maximum 3 files can be uploaded !")
    //   return;

    // } else {
    document.getElementById(key || '')?.click()
    // }
  }

  upload(event: any, type:string) {
    const files = event.target.files;

    // if (files?.length > 1 || this.signUpFormValues?.[type]) {
    //   this.alertService.open('error', "Only One File Is allowed or Remove Existing Image", "Failed");
    //   return
    // }

    this.appService.loaderService = true;
    let selectedFiles: File[] = [];
    let userData = this.storage.api.session.get('userData')
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      selectedFiles.push(files.item(i));
      formData.append('images', files.item(i), userData.employeeId + '_' + new Date().getTime() + '_' + i + '.' + files.item(i).type.split('/').at(-1));
    }


    this.http.post(Config.API.UPLOAD_FILES, formData).subscribe(
      (response: any) => {
        if (response.status === "success") {

          if (response?.data?.[0]) {
            this.signUpFormValues[type] = response.data[0]
          }
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
  changeOfState = () => {
    try {
      this.metaData[this.signUpFormValues['state'] + '_DISTRICTS'] = [];
      this.metaData[this.signUpFormValues['state'] + '_DISTRICT_MANDALS'] = [];
      this.getMetaData(this.signUpFormValues['state'])
    } catch (error) {
      console.error(error)
    }
  }

  removeImage = (key:any, imageInfo:any) => {
    console.log('imageInfo', imageInfo)
    this.appService.deleteS3Images(imageInfo).subscribe(
      (response: any) => {
        if (response.status === "success") {
          this.signUpFormValues[key]=null;
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

  onPageChangeRejectedNews(page: number): void {
    this.employeeListData.page = page;
    this.fetchEmployeeList();
  }
  actionEmitter = (event:any) => {
    try {
      this.actionType = '';
      this.disableFields = false;
      this.signUpFormValues = {};
      if (event.type === 'create') {
        this.disableFields = false;
        this.getMetaData();
        this.actionType = event.type
        document.getElementById('addEmployeeBtn')?.click();
      } else if (event.type === 'active') {
        this.actionType = event.type;
        this.getMetaData(null, true);
        this.disableFields = true;
        this.getEmployeeData(event);
      } else if (event.type === 'inactive') {
        this.actionType = event.type;
        this.getMetaData(null, true);
        this.disableFields = true;
        this.getEmployeeData(event);
      } else if (event.type === 'disable') {
        this.actionType = event.type;
        this.getMetaData(null, true);
        this.disableFields = true;
        this.getEmployeeData(event);

      } else if (event.type === 'enable') {
        this.actionType = event.type;
        this.getMetaData(null, true);
        this.disableFields = true;
        this.getEmployeeData(event);
      } else if (event.type === 'edit') {
        this.actionType = event.type;
        this.getMetaData(null, true);
        this.disableFields = false;
        this.getEmployeeData(event);
      } else if (event.type === 'verify_identity') {
        this.actionType = event.type;
        this.getEmployeeData(event, event.type);
        this.identityVerificationRejectionReason = '';
      }
    } catch (error) {
      console.error(error)
    }
  }
  getMetaData = (stateId?: any, callFurtercalls?: any) => {
    try {
      // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
      this.appService.loaderService = true;
      const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS'] : ['STATES', 'ROLE', 'BLOOD_GROUP']
      this.appService.getMetaData({ metaList }).subscribe((response) => {
        this.metaData = { ...this.metaData, ...response['data'] || {} }
        if (callFurtercalls) {
          this.getMetaData(this.signUpFormValues.state)
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }
  

  getEmployeeData = (event:any, eventType?: any) => {
    try {
      this.appService.loaderService = true;
      this.appService.getEmployeeData({ data: event.rowData }).subscribe((response) => {
        if (response.status === 'success') {
          this.signUpFormValues = response.data;
          if (eventType && eventType === 'verify_identity') {
            if (!response.data.profilePicture) {
              this.alertService.open("error", "Profile Picture Not Available", 'Profile Picture not uploaded!');
              return
            }
            if (!response.data.identityProof) {
              this.alertService.open("error", "Document Not Available", 'Idenity Proof not uploaded!');
              return
            }
            document.getElementById('identityVerifactionBtn')?.click();
          } else {
            document.getElementById('addEmployeeBtn')?.click();

          }
        } else {
          this.alertService.open("error", "Failed", response.msg || 'failed');
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;
    }
  }
  signUpCreds = () => {
    try {
      this.appService.loaderService = true;
      const userData = this.storage.api.session.get('userData');
      this.appService.manipulateEmployee({ type: this.actionType, data: this.signUpFormValues }).subscribe((response) => {
        if (response.status === 'success') {
          this.alertService.open("success", "Success", response.msg || " ");
          document.getElementById('addEmployeeBtn')?.click();
          if (userData.employeeId === this.signUpFormValues.employeeId) {
            setTimeout(() => {
              this.alertService.open("info", "Info", "Profile Updated... Kindly relogin");
              this.storage.api.session.remove('userData');
              this.router.navigate(['']);
            }, 500);
          } else {
            this.fetchEmployeeList();
          }
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error);
      this.appService.loaderService = false;
    }
  }
  updateVerification = (status:any) => {
    try {
      this.appService.loaderService = true;
      this.appService.manipulateEmployee({ type: this.actionType, data: this.signUpFormValues, status: status, reason: this.identityVerificationRejectionReason }).subscribe((response) => {
        if (response.status === 'success') {
          this.alertService.open("success", "Success", response.msg || " ");
          document.getElementById('identityVerifactionBtn')?.click();
          const userData = this.storage.api.session.get('userData');
          if (userData.employeeId === this.signUpFormValues.employeeId) {
            setTimeout(() => {
              this.alertService.open("info", "Info", "Profile Updated... Kindly relogin");
              this.storage.api.session.remove('userData');
              this.router.navigate(['']);
            }, 500);
          } else {
            this.fetchEmployeeList();
          }
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

}
