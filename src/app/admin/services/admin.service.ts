import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public readonly API_ENDPOINTS = {


    // OTP Management for LOGIN
    OTP_SEND_OTP: `/public/login/send-otp`,
    OTP_VERIFY_OTP: `/public/login/verify-otp`,


    // News Management
    PENDING_NEWS: `/admin/news/pending`,
    APPROVED_NEWS: `/admin/news/approved`,
    REJECTED_NEWS: `/admin/news/rejected`,
    NEWS_UPLOAD_IMAGES: `/uploadFiles`,

    NEWS_ACTIVE_EMPLOYEES: `/admin/news/active-employees`,
    MANIPULATE_NEWS:'/admin/manipulateNews',

    NEWS_INFO: `/admin/getIndividualNewsInfo`,
    EMPLOYEES_LIST: `/admin/employeesData`,
    EMPLOYEE_INFO: `/admin/individualEmployeeData`,
    MANIPULATE_INDIVIDUAL_EMPLOYEE:'/admin/manipulateIndividualEmployee',
    EMPLOYEE_TRACING:'/admin/employeeTracingListing',
    MANIPULATE_EMPLOYEE_TRACING:'/admin/employeeTracingManagement',
    EMPLOYEE_TRACING_ACTIVE_EMPLOYEE_LIST:'/admin/employeeTracingActiveEmployeeList',
    DASHBOARD_VISITER_STATS_INFO:'/admin/getPageViewDashboardInfo',
    DASHBOARD_ARTICLES_STATS_INFO:'/admin/getArticlesDashbordInfo',
    GET_ARTICLES_BY_CATEGORY:'/admin/getArticlesByCategory',
    GET_ACTIVE_EMPLOYEE_STATS:'/admin/getActiveEmployeeStats',
    GET_VISITOR_TIME_SERIES:'/admin/getVisitorTimeSeries',
    GET_VISITS_TIME_SERIES:'/admin/getVisitsTimeSeries',
    GET_VISITOR_LOCATIONS:'/admin/getVisitorLocations',


    NEWS_APPROVE: `/admin/news/approve`,
    NEWS_REJECT: `/admin/news/reject`,
    NEWS_CREATE: `/admin/news/create`,
    NEWS_UPDATE: `/admin/news/update`,
    NEWS_DELETE: `/admin/news/delete`,
    NEWS_FEATURE: `/admin/news/feature`,
    DELETE_S3_IMAGES: `/admin/news/delete-image`,
    
    // Category Management
    CATEGORIES: `/admin/categories`,
    CATEGORY_CREATE: `/admin/categories/create`,
    CATEGORY_UPDATE: `/admin/categories/update`,
    CATEGORY_DELETE: `/admin/categories/delete`,
    
    // User Management
    USERS: `/admin/users`,
    USER_CREATE: `/admin/users/create`,
    USER_UPDATE: `/admin/users/update`,
    USER_DELETE: `/admin/users/delete`,
    
    // Dashboard
    DASHBOARD_STATS: `/admin/dashboard/stats`,
    
    // Metadata
    META_DATA: `/admin/metaData`
  };

  // Loader service to track loading state
  private _loaderService = new BehaviorSubject<boolean>(false);
  
  // Getter and setter for loader service
  get loaderService(): boolean {
    return this._loaderService.value;
  }
  
  set loaderService(value: boolean) {
    this._loaderService.next(value);
  }

  constructor(private httpService: HttpService) { }

  /**
   * Get pending news with pagination
   */
  getPendingNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.PENDING_NEWS, { ...params });
  }

  /**
   * Fetch pending news list with pagination
   */
  fetchPendingNewsList(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.PENDING_NEWS, { ...params });
  }
  fetchApprovedNewsList(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.APPROVED_NEWS, { ...params });
  }
  fetchRejectedNewsList(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.REJECTED_NEWS, { ...params });
  }
  fetchNewsActiveEmployees(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.NEWS_ACTIVE_EMPLOYEES, { ...params });
  }

  /**
   * Get approved news with pagination
   */
  getApprovedNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.APPROVED_NEWS, { ...params }, undefined, undefined, true);
  }
  /**
   * Get employees list with pagination
   */
  getEmployeesList(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.EMPLOYEES_LIST, { ...params }, undefined, undefined, true);
  }

  /**
   * Get employee information by ID
   */
  getEmployeeData(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.EMPLOYEE_INFO, { ...params }, undefined, undefined, true);
  }

  /**
   * Manipulate individual employee
   */
  manipulateIndividualEmployee(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.MANIPULATE_INDIVIDUAL_EMPLOYEE, { ...params },undefined,undefined,false,true);
  }


  /**
   * Get news information by ID
   */
  getNewsInfo(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.NEWS_INFO, { ...params }, undefined, undefined, true);
  }

  /**
   * Approve a news article
   */
  approveNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.MANIPULATE_NEWS, { ...params },undefined,undefined,true);
  }

  /**
   * Reject a news article
   */
  rejectNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.MANIPULATE_NEWS, { ...params },undefined,undefined,true);
  }

  /**
   * Create a new news article
   */
  createNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.MANIPULATE_NEWS, { ...params },undefined,undefined,true);
  }

  /**
   * Update an existing news article
   */
  updateNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.MANIPULATE_NEWS, { ...params },undefined,undefined,true);
  }

  /**
   * Delete a news article
   */
  deleteNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.MANIPULATE_NEWS, { ...params },undefined,undefined,true);
  }

  /**
   * Delete S3 images
   */
  deleteS3Images(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.DELETE_S3_IMAGES, { ...params });
  }


  /**
   * Upload images for a news article
   */
  uploadNewsImages(formData: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.NEWS_UPLOAD_IMAGES, null, undefined, formData);
  }

  /**
   * Get metadata for admin operations
   */
  getMetaData(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.META_DATA,{ ...params }, undefined, undefined, true);
  }

  /**
   * Get employee tracing list
   */
  getEmployeTracingList(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.EMPLOYEE_TRACING, { ...params }, undefined, undefined, true);
  }

  /**
   * Manipulate employee tracing
   */
  manipulateEmployeTracing(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.MANIPULATE_EMPLOYEE_TRACING, { ...params },undefined,undefined,true,true);
  }

  /**
   * Get all employeeTracingActiveEmployeeList
   */
  getEmployeeTracingActiveEmployeeList(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.EMPLOYEE_TRACING_ACTIVE_EMPLOYEE_LIST, { ...params }, undefined, undefined, true);
  }

  /**
   * Manipulate news (create, update, approve, reject)
   */
  manipulateNews(params: any): Observable<any> {
    const { type, data } = params;
    
    switch (type) {
      case 'create':
        return this.createNews(params);
      case 'update':
        return this.updateNews(params);
      case 'approve':
        return this.approveNews(params);
      case 'reject':
        return this.rejectNews(params);
      default:
        throw new Error(`Unknown manipulation type: ${type}`);
    }
  }

  /**
   * Get dashboard visitor stats info
   */
  getDashboardVisitorStatsInfo(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.DASHBOARD_VISITER_STATS_INFO, { ...params }, undefined, undefined, true);
  }

  /**
   * Get dashboard articles stats info
   */
  getDashboardArticlesStatsInfo(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.DASHBOARD_ARTICLES_STATS_INFO, { ...params }, undefined, undefined, true);
  }

  /**
   * Get articles by category
   */
  getArticlesByCategory(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.GET_ARTICLES_BY_CATEGORY, { ...params }, undefined, undefined, true);
  }

  /**
   * Get active employee stats
   */
  getActiveEmployeeStats(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.GET_ACTIVE_EMPLOYEE_STATS, { ...params }, undefined, undefined, true);
  }

  /**
   * Get visitor time series
   */
  getVisitorTimeSeries(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.GET_VISITOR_TIME_SERIES, { ...params }, undefined, undefined, true);
  }

  /**
   * Get visits time series
   */
  getVisitsTimeSeries(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.GET_VISITS_TIME_SERIES, { ...params }, undefined, undefined, true);
  }

  /**
   * Get visitor locations
   */
  getVisitorLocations(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.GET_VISITOR_LOCATIONS, { ...params }, undefined, undefined, true);
  }

  /**
   * OTP Management for LOGIN
   */
  sendOtp(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.OTP_SEND_OTP, { ...params }, undefined, undefined, true);
  }

  /**
   * OTP Management for LOGIN
   */
  verifyOtp(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.OTP_VERIFY_OTP, { ...params }, undefined, undefined, true);
  }
}
