import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { MessageService } from '../../services/message.service';
import { CommonFunctionalityService } from '../../services/common-functionality.service';
import { AdminService } from '../../services/admin.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
declare var bootstrap: any;



@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent implements OnInit {



  @ViewChild('addEmployeeBtnBtn', { static: false }) addEmployeeBtnBtn!: ElementRef;

  public selectedCar: any = "Active";

  public employeeInfo: any = {};
  private baseUrl = environment.BE_BASE_URL;


  constructor(public adminService: AdminService, private alertService: MessageService, private storage: StorageService, private router: Router, private http: HttpClient, private _activatedRoute: ActivatedRoute) {
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


  changeOfNewsType = () => {
    try {
      this.employeeListData.page = 1;

      this.fetchEmployeeList();
    } catch (error) {
      console.error(error)

    }
  }
  public internalLoader: boolean = false;
  fetchEmployeeList = () => {
    try {
      // this.pageData=null;
      let payload = {}
      this.internalLoader = true;
      const userData = this.storage.getStoredUser()
      this.adminService.getEmployeesList({ ...this.employeeListData, ...userData }).subscribe((response: any) => {
        console.log("response", response)
        if (response) {
          if (response) {

            console.log(response)
            this.employeeListData.tableLoaded = true;
            this.employeeListData.header = response?.header || []
            this.employeeListData.body = response?.['data'] || []
            this.employeeListData.metaData = response?.metadata || []
            this.employeeListData.totalNumberOfRecords = response?.metadata?.[0]?.['total'] || []
            console.log(this.employeeListData)

          }
          // console.log(response)
        } else {
          this.alertService.showError(response.msg || "Failed !")
        }
        this.internalLoader = false;
      }, (error) => {
        console.error(error);
        this.internalLoader = false;
      })
    } catch (error) {
      this.internalLoader = false;
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
  openImageUpload(key: any) {

    // if (this.publishNewsForm['images'] && this.publishNewsForm['images'].length > 3) {
    //   // alert("You have reached maximum limit of images!");
    //   this.alertService.open('error', "Limit Reached", "Maximum 3 files can be uploaded !")
    //   return;

    // } else {
    document.getElementById(key || '')?.click()
    // }
  }

  upload(event: any, type: string) {
    const files = event.target.files;

    // if (files?.length > 1 || this.signUpFormValues?.[type]) {
    //   this.alertService.open('error', "Only One File Is allowed or Remove Existing Image", "Failed");
    //   return
    // }

    this.internalLoader = true;
    let selectedFiles: File[] = [];
    let userData = this.storage.getStoredUser()
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      selectedFiles.push(files.item(i));
      formData.append('images', files.item(i), userData.employeeId + '_' + new Date().getTime() + '_' + i + '.' + files.item(i).type.split('/').at(-1));
    }


    this.http.post(`${this.baseUrl}${this.adminService.API_ENDPOINTS.NEWS_UPLOAD_IMAGES}`, formData).subscribe(
      (response: any) => {
        if (response.status === "success") {

          if (response?.data?.[0]) {
            this.signUpFormValues[type] = response.data[0]
          }
        } else {
          this.alertService.showError(response.msg || "Failed !")
        }
        this.internalLoader = false;
      },
      (error) => {
        this.internalLoader = false;
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

  removeImage = (key: any, imageInfo: any) => {
    console.log('imageInfo', imageInfo)
    this.adminService.deleteS3Images(imageInfo).subscribe(
      (response: any) => {
        if (response.status === "success") {
          this.signUpFormValues[key] = null;
        } else {
          this.alertService.showError(response.msg || "Failed !")
        }
        this.internalLoader = false;
      },
      (error) => {
        this.internalLoader = false;
        console.error('Upload error:', error);
      });
  }

  onPageChangeRejectedNews(page: number): void {
    this.employeeListData.page = page;
    this.fetchEmployeeList();
  }
  actionEmitter = (event: any) => {
    try {
      this.actionType = '';
      this.disableFields = false;
      this.signUpFormValues = {};
      if (event.type === 'create') {
        this.disableFields = false;
        this.getMetaData();
        this.actionType = event.type;
        this.formModalShowHide('show');
        // document.getElementById('addEmployeeBtn')?.click();
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
      this.internalLoader = true;
      const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS'] : ['STATES', 'ROLE', 'BLOOD_GROUP']
      this.adminService.getMetaData({ metaList }).subscribe((response) => {
        this.metaData = { ...this.metaData, ...response || {} }
        if (callFurtercalls) {
          this.getMetaData(this.signUpFormValues.state)
        }
        this.internalLoader = false;
      })
    } catch (error) {
      this.internalLoader = false;
      console.error(error)
    }
  }


  getEmployeeData = (event: any, eventType?: any) => {
    try {
      this.internalLoader = true;
      this.adminService.getEmployeeData({ data: event.rowData }).subscribe((response) => {
        if (response) {
          this.signUpFormValues = response;

          if(['edit','create','active','inactive','disable','enable'].includes(event?.type)){
            this.formModalShowHide('show')
          }
          if (eventType && eventType === 'verify_identity') {
            if (!response.profilePicture) {
              this.alertService.showError('Profile Picture not uploaded!');
              return
            }
            if (!response.identityProof) {
              this.alertService.showError('Idenity Proof not uploaded!');
              return
            }
            document.getElementById('identityVerifactionBtn')?.click();
          } else {
            document.getElementById('addEmployeeBtn')?.click();

          }
        } else {
          this.alertService.showError(response.msg || 'failed');
        }
        this.internalLoader = false;
      })
    } catch (error) {
      console.error(error);
      this.internalLoader = false;
    }
  }
  signUpCreds = () => {
    try {
      this.internalLoader = true;
      const userData = this.storage.getStoredUser();
      this.adminService.manipulateIndividualEmployee({ type: this.actionType, data: this.signUpFormValues, employeeId: userData.employeeId}).subscribe((response) => {
        if (response) {
          console.log("EDIT UPDATE SUCCESS")
          if(['inactive','active','disable','enable','edit','create'].includes(this.actionType)){
            document.getElementById('closeFormModalBtn')?.click();
          }
          this.alertService.showInfo(response.msg || " ");
          if (userData.employeeId === this.signUpFormValues.employeeId) {
            setTimeout(() => {
              this.alertService.showInfo("Profile Updated... Kindly relogin");
              this.storage.clearStorage();
              this.router.navigate(['/admin']);
            }, 500);
          } else {
            this.fetchEmployeeList();
          }
        } else {
          this.alertService.showError(response.msg || "Failed !")
        }
        this.internalLoader = false;
      })
    } catch (error) {
      console.error(error);
      this.internalLoader = false;
    }
  }
  updateVerification = (status: any) => {
    try {
      this.internalLoader = true;
      this.adminService.manipulateIndividualEmployee({ type: this.actionType, data: this.signUpFormValues, status: status, reason: this.identityVerificationRejectionReason }).subscribe((response) => {
        if (response.status === 'success') {
          this.alertService.showInfo(response.msg || " ");
          document.getElementById('identityVerifactionBtn')?.click();
          const userData = this.storage.getStoredUser();
          if (userData.employeeId === this.signUpFormValues.employeeId) {
            setTimeout(() => {
              this.alertService.showInfo("Profile Updated... Kindly relogin");
              this.storage.clearStorage();
              this.router.navigate(['/admin']);
            }, 500);
          } else {
            this.fetchEmployeeList();
          }
        } else {
          this.alertService.showError(response.msg || "Failed !")
        }
        this.internalLoader = false;
      })
    } catch (error) {
      console.error(error)
      this.internalLoader = false;
    }
  }


  formModalShowHide = (type: any = 'show') => {
    const modal = new bootstrap.Modal(document.getElementById('employeeFormModal'));
    if (type === 'hide') {
      modal.hide();
    } else {
      modal.show();
    }
  }
}

