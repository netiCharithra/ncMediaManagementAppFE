import { Component, OnInit } from '@angular/core';
import { StorageService } from 'app/services/storage.service';
import { Config } from 'app/config/config';
import { HttpClient } from '@angular/common/http';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public userData: any;
  public userUpdateImage: any;
  public userUpdateImageType: any;
  constructor(private storage: StorageService, private http: HttpClient, private alertService: AlertService, public appService:AppServiceService) { }

  ngOnInit() {
    this.userData = this.storage.api.session.get('userData');
  }

  uploadUserImage = () => {
    if (this.userUpdateImageType) {
      document.getElementById('loginimages').click();
    }
  }

  upload(files: FileList): void {


    this.appService.loaderService = true;
    let selectedFiles: File[] = [];
    let userData = this.storage.api.session.get('userData')
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      selectedFiles.push(files.item(i));
      formData.append('images', files.item(i), userData.employeeId + '_' + new Date().getTime() + '_' + i + '.' + files.item(i).type.split('/').at(-1));
    }
    formData.append('uploadType', this.userUpdateImageType)
    formData.append('employeeId', this.userData.employeeId)

    this.http.post(Config.API.UPLOAD_FILES, formData).subscribe(
      (response: any) => {
        if (response.status === "success") {
          if (Object.keys(response.data).length>0){
            this.storage.api.session.save('userData', response.data);
            this.userData = response.data;
          }
          this.alertService.open('success', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")

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
