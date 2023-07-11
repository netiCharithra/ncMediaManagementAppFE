import { Injectable } from '@angular/core';
import { HttpLayerService } from './http-layer.service';
import { Config } from './../config/config';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private _httplayer:HttpLayerService) { }

  userLogin(data: any) {
    console.log(Config.API.USER_LOGIN)
    return this._httplayer.post(Config.API.USER_LOGIN, data);
  }
  
  registerEmploye(data:any){
    return this._httplayer.post(Config.API.REGISTER_EMPLOYEE, data);
    
  }
  
  getDashboardData(data:any){
    return this._httplayer.post(Config.API.FETCH_DASHBOARD, data);

  }
  getMetaData(data:any){
    return this._httplayer.post(Config.API.GET_META_DATA, data);
  }
  getSubscribers(data:any){
    return this._httplayer.post(Config.API.GET_SUBSCRIBERS, data);
  }
  getEmployeesData(data:any){
    return this._httplayer.post(Config.API.EMPLOYEES_DATA, data);
  }
  manipulateEmployee(data:any){
    return this._httplayer.post(Config.API.MANIPULATE_EMPLOYEE, data);
  }
  getEmployeeData(data:any){
    return this._httplayer.post(Config.API.EMPLOYEE_DATA, data);
  }
  getNewsList(data:any){
    return this._httplayer.post(Config.API.GET_NEWS_LIST, data);
  }
  getAllEmployees(data:any){
    return this._httplayer.post(Config.API.GET_ALL_EMPLOYEES, data);
  }
  manipulateNews(data:any){
    return this._httplayer.post(Config.API.MANIPULATE_NEWS, data);
  }
  uploadFiles(data:any){
    return this._httplayer.post(Config.API.UPLOAD_FILES, {}, null, data);
  }
  getNewsInfo(data:any){
    return this._httplayer.post(Config.API.GET_NEWS_INFO, data);
  }
}
