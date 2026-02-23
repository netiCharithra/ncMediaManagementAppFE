export type GrievanceStatus =
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'UNDER_INVESTIGATION'
    | 'RESOLVED'
    | 'REJECTED'
    | 'ESCALATED'
    | 'CLOSED';

/** Body for POST /admin/grievance/list */
export interface GrievanceListRequest {
    employeeId?: string;
    page?: number;
    limit?: number;
    /** Pass 'ALL' to fetch all statuses, or omit when filtering by ticketId / email */
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

export interface GrievancePagination {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
}

export interface GrievanceListResponse {
    grievances: GrievanceSummary[];
    pagination: GrievancePagination;
}

/** GET /public/grievance/admin/:ticketId */
export interface GrievanceAuditEntry {
    status: GrievanceStatus;
    actionTaken: string;
    remarks?: string;
    updatedBy: string;  // employeeId / officerId
    officerName?: string;
    timestamp: number;  // epoch ms
}

export interface GrievanceDetail extends GrievanceSummary {
    description: string;
    evidenceFiles: string[];   // S3 URLs
    timeline: GrievanceAuditEntry[];
}

/** PATCH /public/grievance/admin/:ticketId/action */
export interface GrievanceActionRequest {
    newStatus: GrievanceStatus;
    actionTaken: string;
    remarks: string;
    officerId?: string;
    officerName?: string;
    language?: string;
}

/** Statuses that lock the action form per backend rules */
export const TERMINAL_STATUSES: GrievanceStatus[] = ['RESOLVED', 'REJECTED'];

export const ALL_STATUSES: GrievanceStatus[] = [
    'SUBMITTED',
    'UNDER_REVIEW',
    'UNDER_INVESTIGATION',
    'RESOLVED',
    'REJECTED',
    'ESCALATED',
    'CLOSED',
];

/** Compliance Report Interfaces (aligned with new grievance-report endpoint) */
export interface GrievanceReportCategory {
    category: string;
    total: number;
    resolved: number;
    rejected: number;
    underInvestigation: number;
    avgResolutionHours: number | null;
    minResolutionHours: number | null;
    maxResolutionHours: number | null;
}

export interface MonthlyComplianceTrend {
    year: number;
    month: number;
    total: number;
    resolved: number;
    rejected: number;
    submitted: number;
    underInvestigation: number;
}

export interface GrievanceReportResponse {
    reportWindow: {
        startTime: number;
        endTime: number;
        startTimeIso: string;
        endTimeIso: string;
    };
    overall: {
        total: number;
        submitted: number;
        underInvestigation: number;
        actionTaken: number;
        resolved: number;
        rejected: number;
    };
    byCategory: GrievanceReportCategory[];
    monthlyTrend: MonthlyComplianceTrend[];
}

// Keep older aliases if needed for other components
export interface MonthlyComplianceReport extends MonthlyComplianceTrend {
    pending: number;
    escalated: number;
    avgResolutionDays: number;
}
