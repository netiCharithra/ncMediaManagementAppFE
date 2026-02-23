export type GrievanceStatus =
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'UNDER_INVESTIGATION'
    | 'RESOLVED'
    | 'REJECTED'
    | 'ESCALATED'
    | 'CLOSED';

/** POST /admin/grievance/list — body */
export interface GrievanceListRequest {
    employeeId: string;
    page?: number;
    limit?: number;
    status?: GrievanceStatus | 'ALL' | '';
    email?: string;
    ticketId?: string;
}

export interface GrievanceSummary {
    ticketId: string;
    category: string;
    status: GrievanceStatus;
    complainantName: string;
    complainantEmail: string;
    submittedAt: number; // epoch ms
}

export interface Pagination {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
}

export interface GrievanceListResponse {
    grievances: GrievanceSummary[];
    pagination: Pagination;
}

/** GET /admin/grievances/:ticketId */
export interface GrievanceAuditEntry {
    status: GrievanceStatus;
    actionTaken: string;
    remarks?: string;
    updatedBy: string;    // employeeId
    timestamp: number;   // epoch ms
}

export interface GrievanceDetail extends GrievanceSummary {
    description: string;
    evidenceFiles: string[];  // S3 URLs
    timeline: GrievanceAuditEntry[];
}

/** PATCH /admin/grievances/:ticketId/action */
export interface GrievanceActionRequest {
    newStatus: GrievanceStatus;
    actionTaken: string;
    remarks: string;
}

/** Statuses that lock the form */
export const TERMINAL_STATUSES: GrievanceStatus[] = ['RESOLVED', 'REJECTED'];
