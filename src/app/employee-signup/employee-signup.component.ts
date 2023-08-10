import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from 'app/config/config';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';
import { StorageService } from 'app/services/storage.service';

@Component({
  selector: 'employee-signup',
  templateUrl: './employee-signup.component.html',
  styleUrls: ['./employee-signup.component.scss']
})
export class EmployeeSignupComponent implements OnInit {
public signUpFormValues: any = {};
public metaData:any={
  "ROLE":[],
  "STATES":[]
};

  constructor(private http: HttpClient, private appService: AppServiceService, private alertService: AlertService, public router: Router, private storage: StorageService) { }

  ngOnInit(): void {
    this.getMetaData();
  }

  getMetaData = (stateId?:any) =>{
    try {
      // 'AP_DISTRICTS', 'AP_DISTRICT_MANDALS'
      const metaList = stateId ? [stateId + '_DISTRICTS', stateId + '_DISTRICT_MANDALS'] : ['STATES', 'ROLE']
      this.appService.getMetaData({metaList}).subscribe((response) => {
        this.metaData = { ...this.metaData , ...response['data'] || {}}
      })
    } catch (error) {
      console.error(error)
    }
  }


  changeOfState = () => {
    try {
      this.metaData[this.signUpFormValues['state']+'_DISTRICTS']=[];
      this.metaData[this.signUpFormValues['state'] +'_DISTRICT_MANDALS']=[];
      this.getMetaData(this.signUpFormValues['state'])
    } catch (error) {
      console.error(error)
    }
  }
  openImageUpload(type) {
    document.getElementById(type).click();
  }


  signUpCreds = () => {

    try {
      this.appService.loaderService = true;
      const formData = new FormData();

      for (let i = 0; i < this.signUpFormValues['profilePic'].length; i++) {
        formData.append('profilePic', this.signUpFormValues['profilePic'].item(i));
      }
      for (let i = 0; i < this.signUpFormValues['identityProof'].length; i++) {
        formData.append('identityProof', this.signUpFormValues['identityProof'].item(i));
      }     
      formData.append('name', this.signUpFormValues['name'])
      formData.append('mail', this.signUpFormValues['mail'])
      formData.append('password', this.signUpFormValues['password'])
      formData.append('state', this.signUpFormValues['state'])
      formData.append('district', this.signUpFormValues['district'])
      formData.append('mandal', this.signUpFormValues['mandal'])
      formData.append('mobile', this.signUpFormValues['mobile'])
      formData.append('role', this.signUpFormValues['role'])
      this.http.post(Config.API.REGISTER_EMPLOYEE, formData).subscribe(
        (response: any) => {
          if (response.status === "success") {
            this.alertService.open('success', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
            this.navigate();
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
      } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }

  navigate = (type?: any) => {
    this.router.navigate(['/'])
  }

  
  uploadProfilePic (files){
    this.signUpFormValues['profilePic'] = files;
    this.previewImage(files[0],'profilePicBase64');

  }
  uploadIdentityProof (files){
    this.signUpFormValues['identityProof'] = files;
    this.previewImage(files[0], 'identityProofBase64');

  }

  previewImage(file: File, key) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.signUpFormValues[key] = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
