import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpService } from '../../services/http.service';
import { GrievanceTrackResponse } from '../interfaces/grievance-track.interface';
import {
  GrievanceListRequest,
  GrievanceListResponse,
  GrievanceSummary,
  GrievancePagination,
  GrievanceDetail,
  GrievanceActionRequest,
  GrievanceReportResponse,
} from '../interfaces/grievance-admin.interface';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private readonly API_ENDPOINTS = {
    HOME_LATEST_NEWS: '/public/home/getLatestNews',
    HOME_NEWS_TYPE_CATEGORIZED_NEWS: '/public/home/getNewsTypeCategorizedNews',
    HOME_NEWS_CATEGORY_CATEGORIZED_NEWS: '/public/home/getNewsCategoryCategorizedNews',
    HOME_CATEGORY_NEWS_PAGINATED_ONLY: '/public/home/getCategoryNewsPaginatedOnly',
    HOME_TYPE_NEWS_PAGINATED_ONLY: '/public/home/getTypeCategorizedNewsPaginatedOnly',
    META_DATA: '/public/metaData',
    NEWS_INFO: '/public/newsInfo',
    CATEGORY_NEWS: '/news/category',
    NEWS_DETAIL: '/news',
    SEARCH_NEWS: '/news/search',
    TAGS: '/news/tags',
    EMPLOYEE_ACTIVE_TRACING: '/public/employeeTraceCheck',
    VISITOR_COUNT: '/public/getVisitorsCount',
    GRIEVANCE: '/public/grievance',
    GRIEVANCE_TRACK: '/public/grievance',
    GRIEVANCE_REPORT: '/public/grievance-report'
  };

  constructor(
    private httpService: HttpService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /**
   * Get latest news with pagination
   */
  getLatestNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.HOME_LATEST_NEWS, { ...params });
  }
  getNewsTypeCategorizedNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.HOME_NEWS_TYPE_CATEGORIZED_NEWS, { ...params });
  }
  getNewsCategoryCategorizedNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.HOME_NEWS_CATEGORY_CATEGORIZED_NEWS, { ...params });
  }
  getCategoryNewsPaginatedOnly(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.HOME_CATEGORY_NEWS_PAGINATED_ONLY, { ...params });
  }
  getTypeNewsPaginatedOnly(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.HOME_TYPE_NEWS_PAGINATED_ONLY, { ...params });
  }
  getMetaData(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.META_DATA, { ...params });
  }
  getNewsInfo(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.NEWS_INFO, { ...params });
  }
  employeeTraceCheck(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.EMPLOYEE_ACTIVE_TRACING, { ...params });
  }


  /**
   * Get news by category with pagination
   */
  getNewsByCategory(category: string, params: any, language: string): Observable<any> {
    return this.httpService.post(
      `${this.API_ENDPOINTS.CATEGORY_NEWS}/${category}`,
      { ...params, language }
    );
  }

  /**
   * Get single news detail by ID
   */
  getNewsById(newsId: string, language: string): Observable<any> {
    return this.httpService.post(`${this.API_ENDPOINTS.NEWS_DETAIL}/${newsId}`, { language });
  }

  /**
   * Search news by query
   */
  searchNews(params: any, language: string): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.SEARCH_NEWS, { ...params, language });
  }

  /**
   * Get all available news tags
   */
  getNewsTags(language: string): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.TAGS, { language });
  }

  /**
   * Get news by tag with pagination
   */
  getNewsByTag(tag: string, params: any, language: string): Observable<any> {
    return this.httpService.post(
      `${this.API_ENDPOINTS.NEWS_DETAIL}`,
      {
        ...params,
        tag,
        language
      }
    );
  }


  getVisitorCount(): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.VISITOR_COUNT, {});
  }

  /**
   * Submit a grievance complaint (multipart/form-data)
   * POST api/v3/public/grivaance
   */
  submitGrievance(formData: FormData): Observable<any> {
    // Pass formData as the 4th argument so HttpService sends it as-is (multipart)
    return this.httpService.post(
      this.API_ENDPOINTS.GRIEVANCE,
      {},          // body – ignored when formData is provided
      undefined,   // no custom headers – browser sets Content-Type with boundary
      formData,    // raw FormData
      false,       // loggedUserDetails
      true         // returnEntireResponse – so we can read referenceId
    );
  }

  /**
   * Track a grievance complaint by Ticket ID.
   * GET /public/grievance/:ticketId/track
   */
  trackGrievance(ticketId: string): Observable<GrievanceTrackResponse> {
    return this.httpService.get(
      `${this.API_ENDPOINTS.GRIEVANCE_TRACK}/${ticketId}/track`
    ).pipe(
      map((res: any) => {
        const item = res?.data || res;
        const history = item.timeline || item.statusHistory || [];
        const lastUpdate = history.length > 0 ? history[history.length - 1].updatedAt || history[history.length - 1].timestamp : 0;

        return {
          ticketId: item.ticketId,
          currentStatus: item.currentStatus || 'SUBMITTED',
          complainantName: item.complainantName || item.complainantDetails?.name || 'Anonymous',
          complainantEmail: item.complainantEmail || item.complainantDetails?.email || '',
          grievanceCategory: item.issue?.category || item.grievanceCategory || 'OTHER',
          contentUrl: item.issue?.contentUrl || item.contentUrl || '',
          description: item.issue?.description || item.description || '',
          submittedAt: item.submittedOn || item.submittedAt || item.createdAt || 0,
          updatedAt: item.updatedAt || lastUpdate || item.submittedOn || item.createdAt || 0,
          timeline: history.map((t: any) => ({
            status: t.status,
            actionTaken: t.actionTaken || t.remarks || '',
            timestamp: t.updatedAt || t.timestamp || 0,
            updatedBy: t.officerName || t.processedBy || t.updatedBy || t.officerId || ''
          }))
        };
      })
    );
  }

  // ─── Grievance Admin API ─────────────────────────────────────────────────────

  private readonly ADMIN_BASE = '/grievance/admin';

  /** Build adminAuth header from localStorage */
  private adminHeaders(): HttpHeaders {
    if (!isPlatformBrowser(this.platformId)) {
      return new HttpHeaders({ adminAuth: '' });
    }
    let employeeId = localStorage.getItem('officer_id') || '';
    if (!employeeId) {
      const user = localStorage.getItem('nc_auth_user');
      try {
        employeeId = user ? JSON.parse(user)?.employeeId ?? '' : '';
      } catch { }
    }
    return new HttpHeaders({ adminAuth: employeeId });
  }

  /**
   * List grievances with optional filters & pagination.
   * POST /admin/grievance/list
   */
  listGrievances(params: GrievanceListRequest): Observable<GrievanceListResponse> {
    const body: any = {};

    if (params.employeeId && params.employeeId.trim()) {
      body.employeeId = params.employeeId.trim();
    }

    // If searching by unique record (Ticket ID or Email), status is optional/omitted by default.
    // Otherwise, we default to 'ALL' if no specific status is selected.
    if (!params.ticketId && !params.email) {
      body.status = params.status ? params.status : 'ALL';
    } else if (params.status) {
      body.status = params.status;
    }

    if (params.page) body.page = params.page;
    if (params.limit) body.limit = params.limit;
    if (params.ticketId && params.ticketId.trim()) body.ticketId = params.ticketId.trim();
    if (params.email && params.email.trim()) body.email = params.email.trim();

    return this.httpService.post(
      `${this.ADMIN_BASE}/list`,
      body,
      this.adminHeaders(),
      null,    // formData
      false,   // loggedUserDetails
      true     // returnEntireResponse – to access res.pagination
    ).pipe(
      map((res: any) => {
        const grievances: GrievanceSummary[] = (res?.data || []).map((item: any) => ({
          ticketId: item.ticketId,
          category: item.issue?.category ?? 'OTHER',
          status: item.currentStatus || 'SUBMITTED',
          complainantName: item.complainantDetails?.name ?? 'Anonymous',
          complainantEmail: item.complainantDetails?.email ?? '',
          submittedAt: item.createdAt || 0
        }));

        const pagination: GrievancePagination = {
          totalRecords: res?.pagination?.total ?? 0,
          currentPage: res?.pagination?.page ?? 1,
          totalPages: res?.pagination?.totalPages ?? 1,
          limit: res?.pagination?.limit ?? 10
        };

        return { grievances, pagination };
      })
    );
  }

  /**
   * Get full grievance detail + audit trail.
   * GET /public/grievance/admin/:ticketId
   */
  getGrievanceDetail(ticketId: string): Observable<GrievanceDetail> {
    return this.httpService.post(`${this.ADMIN_BASE}/detail`, { ticketId }, this.adminHeaders()).pipe(
      map((item: any) => ({
        ticketId: item.ticketId,
        category: item.issue?.category ?? 'OTHER',
        status: item.currentStatus || 'SUBMITTED',
        complainantName: item.complainantDetails?.name ?? 'Anonymous',
        complainantEmail: item.complainantDetails?.email ?? '',
        submittedAt: item.createdAt || 0,
        description: item.issue?.description ?? '',
        evidenceFiles: item.evidence || [],
        timeline: (item.statusHistory || []).map((t: any) => ({
          status: t.status,
          actionTaken: t.actionTaken,
          remarks: t.remarks,
          updatedBy: t.processedBy || t.officerId || '',
          officerName: t.officerName || '',
          timestamp: t.updatedAt
        }))
      }))
    );
  }

  /**
   * Log a progress update / status transition.
   * PATCH /public/grievance/admin/:ticketId/action
   */
  patchGrievanceAction(ticketId: string, body: GrievanceActionRequest): Observable<any> {
    return this.httpService.patch(`${this.ADMIN_BASE}/${ticketId}/action`, body, this.adminHeaders());
  }

  /**
   * Grievance report for a given time range.
   * GET /public/grievance-report?startTime=ms&endTime=ms
   */
  getGrievanceReport(startTime: number, endTime: number): Observable<any> {
    return this.httpService.get(
      this.API_ENDPOINTS.GRIEVANCE_REPORT,
      { startTime, endTime }
    );
  }

  /**
   * Request OTP for Grievance Officer Login.
   * POST /public/grievance/admin/officer/login/send-otp
   */
  requestOfficerOtp(body: { identifier: string }): Observable<any> {
    return this.httpService.post(`${this.ADMIN_BASE}/officer/login/send-otp`, body);
  }

  /**
   * Verify OTP & Login Grievance Officer.
   * POST /public/grievance/admin/officer/login/verify-otp
   */
  verifyOfficerOtp(body: { identifier: string; otp: string }): Observable<any> {
    return this.httpService.post(`${this.ADMIN_BASE}/officer/login/verify-otp`, body);
  }
}
