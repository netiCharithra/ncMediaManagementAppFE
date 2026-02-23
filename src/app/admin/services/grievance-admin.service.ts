import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminHttpService } from './admin-http.service';
import {
    GrievanceListRequest,
    GrievanceListResponse,
    GrievanceDetail,
    GrievanceActionRequest,
} from '../interfaces/grievance-admin.interface';

@Injectable({ providedIn: 'root' })
export class GrievanceAdminService {

    private readonly BASE = '/grievances';

    constructor(private http: AdminHttpService) { }

    /** GET /admin/grievances?page=&limit=&status=&email=&ticketId= */
    listGrievances(params: GrievanceListRequest): Observable<GrievanceListResponse> {
        // Strip empty string values so they don't pollute the query string
        const clean: any = {};
        (Object.keys(params) as Array<keyof GrievanceListRequest>).forEach(k => {
            const v = params[k];
            if (v !== '' && v !== undefined && v !== null) {
                clean[k] = v;
            }
        });
        return this.http.get(this.BASE, clean);
    }

    /** GET /admin/grievances/:ticketId */
    getGrievance(ticketId: string): Observable<GrievanceDetail> {
        return this.http.get(`${this.BASE}/${ticketId}`);
    }

    /** PATCH /admin/grievances/:ticketId/action */
    patchAction(ticketId: string, body: GrievanceActionRequest): Observable<any> {
        return this.http.patch(`${this.BASE}/${ticketId}/action`, body);
    }
}
