import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Config } from 'app/config/config';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';
import { StorageService } from 'app/services/storage.service';
import { AsyncSubject, Observable } from 'rxjs';

@Component({
  selector: 'news-publication',
  templateUrl: './news-publication.component.html',
  styleUrls: ['./news-publication.component.scss']
})
export class NewsPublicationComponent implements OnInit {
  public newsTables: any = {};
  public images: any = ''; 

  public publishNewsForm: any = {};
  public metaData: any = {
    "ROLE": [],
    "STATES": []
  };
  public actionType: any = '';
  public disableFields: Boolean = false;
  constructor(private appService: AppServiceService, private alertService: AlertService, private http: HttpClient, private storage:StorageService) { }

  ngOnInit(): void {
    this.getNewsList()
  }

  getNewsList = () => {
    try {
      this.appService.loaderService = true;

      this.appService.getNewsList({}).subscribe((response) => {
        if (response.status === 'success') {
          this.newsTables = response['data'] || {};
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error)
    }
  }

  getNewsInfo = (data:any) => {
    try {
      this.appService.loaderService = true;
      this.appService.getNewsInfo(data).subscribe((response) => {
        if (response.status === 'success') {
          this.publishNewsForm = response['data'] || {};
          document.getElementById('publishNewsBtn').click();
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

  actionEmitter = (event) => {
    try {


      const userData = this.storage.api.session.get('userData'); 

      if (!userData['profilePicture'] || !userData['identityProof']){
        this.alertService.open('error', 'Verification pending..!', "Please upload profile picture and identity proof in order to proceed..!")
        return
      }
      
      if (!userData['identityVerificationStatus'] || (userData['identityVerificationStatus'] === 'pending')){
        this.alertService.open('error', 'Verification pending..!', "Identity Verification Not Approved yet..! Contact your supirior")
        return
      }
      if (!userData['identityVerificationStatus'] || (userData['identityVerificationStatus'] === 'rejected')){
        this.alertService.open('error', 'Identity Verification Error..!', "Identity Verification failed..! Reupload the documents and Contact your supirior")
        return
      }
      this.disableFields=false;
      this.actionType = event.type;
      this.publishNewsForm={};
      if(event.type==='create'){
        this.disableFields=false;
         this.getMetaData();
        document.getElementById('publishNewsBtn').click();
      } else if(event.type === 'approve'){
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
        this.actionType = event.type;
        this.getMetaData(null, true, event);
        this.disableFields = true;    
      } 
    } catch (error) {
      console.error(error)
    }
  }
  getMetaData = (stateId?: any, callFurtercalls?: any, eventRowData?:any) => {
    try {
      this.appService.loaderService = true;
      // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
      const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS'] : ['STATES', 'ROLE']
      this.appService.getMetaData({ metaList }).subscribe((response) => {
        this.metaData = { ...this.metaData, ...response['data'] || {} }
        if (callFurtercalls) {
          const index = this.metaData['STATES'].findIndex(elem => elem.label === eventRowData['rowData'].state )
          if(index>-1){            
            this.getMetaData(this.metaData['STATES'][index]['value'], false, eventRowData);
          }          
        }
        if (!callFurtercalls && eventRowData){
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


  changeOfState = () => {
    try {
      this.metaData[this.publishNewsForm['state'] + '_DISTRICTS'] = [];
      this.metaData[this.publishNewsForm['state'] + '_DISTRICT_MANDALS'] = [];
      this.getMetaData(this.publishNewsForm['state'])
    } catch (error) {
      console.error(error)
    }
  }

  signUpCreds = () => {
    this.appService.loaderService = true;
    try {
      this.appService.manipulateNews({ type: this.actionType, data: this.publishNewsForm }).subscribe((response) => {
        if (response.status === 'success') {
          this.alertService.open("success", "Success", response.msg || " ");
          document.getElementById('publishNewsBtn').click();
          this.getNewsList();
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
  
  onFilesSelected(event: any) {
    let files= event.target.files;
    let readers = [];


    for (let i = 0; i < files.length; i++) {
      let file: File = files[i];
      let reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        let base64Data: string = e.target.result;
        if (!this.publishNewsForm['images']) {
          this.publishNewsForm['images'] = []
        }
        if (this.publishNewsForm['images'].length>=3){
          this.alertService.open('error', "Limit Reached", "Maximum 3 files can be stored !")
          return 
        } else {
          this.publishNewsForm['images'].push(base64Data);
        }
      };
      reader.readAsDataURL(file);    
    }
  }
  openImageUpload(){

    if (this.publishNewsForm['images'] && this.publishNewsForm['images'].length>3){
      // alert("You have reached maximum limit of images!");
      this.alertService.open('error', "Limit Reached", "Maximum 3 files can be uploaded !")
      return;

    } else {
      document.getElementById('loginimages').click()
    }
  }

  removeImage = (index) =>{
    this.publishNewsForm['images'].splice(index,1)
  }


  changeOfUploadImages = (e) => {
    let myFiles:any=[];
    const frmData = new FormData();
    }


  upload(files: FileList): void {
    if (this.publishNewsForm['images'] && this.publishNewsForm['images'].length > 3) {
      // alert("You have reached maximum limit of images!");
      this.alertService.open('error', "Limit Reached", "Maximum 3 files can be uploaded !")
      return;

    } else {


      if ((this.publishNewsForm?.images && this.publishNewsForm['images'].length + files.length)>3){
        this.alertService.open('error', "Limit Issue", this.publishNewsForm['images'].length + " file(s) already uploaded.. Only " + (3 - this.publishNewsForm['images'].length) +' image(s) are allowed..');
        return;
      }
      this.appService.loaderService = true;
      let selectedFiles:File[]=[];
      let userData = this.storage.api.session.get('userData')
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        selectedFiles.push(files.item(i));
        formData.append('images', files.item(i), userData.employeeId + '_' + new Date().getTime() + '_' + i + '.' + files.item(i).type.split('/').at(-1));
  
      }
  
      this.http.post(Config.API.UPLOAD_FILES, formData).subscribe(
        (response:any) => {
          if(response.status === "success"){
            if (!this.publishNewsForm['images']){
              this.publishNewsForm['images'] = [];
            }
            response.data.forEach(element => {
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
        }
      );
    }
  }
}
