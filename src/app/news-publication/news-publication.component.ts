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
      this.appService.getNewsList({}).subscribe((response) => {
        // this.toaster.toast('error', 'Error', response.msg || "MESSS", true);
        console.log(response)
        if (response.status === 'success') {
          console.log(response['data']);
          this.newsTables = response['data'] || {}
          // this.alertService.open("success", "Success", response.msg || " ");
          // this.router.navigate(['/login']);
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  getNewsInfo = (data:any) => {
    try {
      this.appService.getNewsInfo(data).subscribe((response) => {
        // this.toaster.toast('error', 'Error', response.msg || "MESSS", true);
        console.log(response)
        if (response.status === 'success') {
          console.log(response['data']);
          this.publishNewsForm = response['data'] || {};
          document.getElementById('publishNewsBtn').click();
          // this.alertService.open("success", "Success", response.msg || " ");
          // this.router.navigate(['/login']);
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  actionEmitter = (event) => {
    try {
      this.disableFields=false;
      this.actionType = event.type;
      this.publishNewsForm={};
      console.log(event)
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
        // this.getNewsInfo(event);      
      }
    } catch (error) {
      console.error(error)
    }
  }
  getMetaData = (stateId?: any, callFurtercalls?: any, eventRowData?:any) => {
    try {
      // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
      const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS'] : ['STATES', 'ROLE']
      this.appService.getMetaData({ metaList }).subscribe((response) => {
        console.log(response)
        this.metaData = { ...this.metaData, ...response['data'] || {} }
        if (callFurtercalls) {

          const index = this.metaData['STATES'].findIndex(elem => elem.label === eventRowData['rowData'].state )

          if(index>-1){

            this.getMetaData(this.metaData['STATES'][index]['value'], false, eventRowData)
          }

        }
        if (!callFurtercalls && eventRowData){
          // this.publishNewsForm = eventRowData['rowData']
          this.getNewsInfo(eventRowData['rowData']);
        }
        console.log(this.metaData)
      })
    } catch (error) {
      console.error(error)
    }
  }


  changeOfState = () => {
    try {
      console.log(this.publishNewsForm['state'])
      this.metaData[this.publishNewsForm['state'] + '_DISTRICTS'] = [];
      this.metaData[this.publishNewsForm['state'] + '_DISTRICT_MANDALS'] = [];
      this.getMetaData(this.publishNewsForm['state'])
    } catch (error) {
      console.error(error)
    }
  }

  signUpCreds = () => {
    console.log(this.publishNewsForm);
    try {
      this.appService.manipulateNews({ type: this.actionType, data: this.publishNewsForm }).subscribe((response) => {
        // this.toaster.toast('error', 'Error', response.msg || "MESSS", true);
        console.log(response)
        if (response.status === 'success') {
          this.alertService.open("success", "Success", response.msg || " ");
          document.getElementById('publishNewsBtn').click();
          this.getNewsList();
          // this.router.navigate(['/login']);
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  // changeOfUploadImages = (event:any) => {
  //   try {
  //     console.log(event)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  onFilesSelected(event: any) {
    let files= event.target.files;
    let readers = [];


    for (let i = 0; i < files.length; i++) {
      let file: File = files[i];
      let reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        let base64Data: string = e.target.result;
        console.log(base64Data); // You can use the base64 data as needed
        if (!this.publishNewsForm['images']) {
          this.publishNewsForm['images'] = []
        }
        if (this.publishNewsForm['images'].length>=3){
          this.alertService.open('error', "Limit Reached", "Maximum 3 files can be stored !")
          return 
        } else {
          this.publishNewsForm['images'].push(base64Data);
        }
        // this.publishNewsForm['images'].push((base64Data.toString()).split('base64,').at(-1));
      };

      reader.readAsDataURL(file);
      
      console.log(reader.toString())
      // console.log((reader.toString()).split('base64,').at(-1))
      // this.publishNewsForm['images'].push((reader.toString()).split('base64,').at(-1));
      console.log(this.publishNewsForm)
    }
    console.log(readers)
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



  sendFormDataAsBinary(formData: FormData) {
    // Create headers to specify the content type
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream'
    });

    // Make the HTTP post request
    this.http.post(Config.API.UPLOAD_FILES, formData, { headers: headers, responseType: 'blob' })
      .subscribe((response: Blob) => {
        // Handle the response
        // For example, you can create a download link for the binary data
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(response);
        downloadLink.href = url;
        downloadLink.download = 'file.bin';
        downloadLink.click();
        window.URL.revokeObjectURL(url);
      }, (error) => {
        // Handle the error
        console.error('Error:', error);
      });
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
        },
        (error) => {
          console.error('Upload error:', error);
        }
      );
    }
  }
}
