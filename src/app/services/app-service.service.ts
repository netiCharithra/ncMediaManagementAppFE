import { Injectable } from '@angular/core';
import { HttpLayerService } from './http-layer.service';
import { Config } from './../config/config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  public loaderService:boolean=false;
  constructor(private _httplayer: HttpLayerService, private router: Router) { }
  navigateTo = (data: any) => {
    if (data.type === 'category') {
      this.router.navigate(['/category-news', data.queryParams.category]);

    }
  }
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
  addSubscribers(data: any) {
    return this._httplayer.post(Config.API.ADD_SUBSCRIBERS, data);
  }
  addSubscriberToGroup(data: any) {
    return this._httplayer.post(Config.API.ADD_SUBSCRIBER_TO_GROUP, data);
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
  getAllEmployeesv2(data:any){
    return this._httplayer.post(Config.API.GET_ALL_EMPLOYEES_V2, data);
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
  deleteS3Images(data:any){
    return this._httplayer.post(Config.API.DELETES3IMAGES, data);
  }
  getEmployeTracingList(data:any){
    return this._httplayer.post(Config.API.EMPLOYEE_TRACING_LIST, data);
  }
  manipulateEmployeTracing(data:any){
    return this._httplayer.post(Config.API.MANIPULATE_EMPLOYEE_TRACING, data);
  }
  employeeTracingCheck(data:any){
    return this._httplayer.post(Config.API.EMPLOYEE_TRACING_CHECK, data);
  }
  
  getHomeData(data:any){
    return this._httplayer.post(Config.API.GET_HOME_DATA, data);
  }
  getPublicNewsInfo(data:any){
    return this._httplayer.post(Config.API.GET_PUBLIC_NEWS_INFO, data);
  }
  getCategoryNews(data:any){
    return this._httplayer.post(Config.API.GET_PUBLIC_CATEGORY_NEWS, data);
  }
  setFCMToken(data:any){
    return this._httplayer.post(Config.API.SET_FCM_TOKEN, data);
  }
}
