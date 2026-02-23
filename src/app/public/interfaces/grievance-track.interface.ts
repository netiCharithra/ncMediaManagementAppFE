/**
 * Grievance Track Response – mirrors the backend GrievanceTrackResponse schema.
 *
 * Endpoint: GET /public/grievance/:ticketId/track
 */
export interface GrievanceTimelineEntry {
    status: GrievanceStatus;
    actionTaken: string;
    timestamp: number; // Unix epoch (ms)
    updatedBy?: string;
}

export type GrievanceStatus =
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'UNDER_INVESTIGATION'
    | 'RESOLVED'
    | 'REJECTED'
    | 'ESCALATED'
    | 'CLOSED';

export interface GrievanceTrackResponse {
    ticketId: string;
    currentStatus: GrievanceStatus;
    complainantName: string;
    complainantEmail?: string;
    grievanceCategory: string;
    contentUrl?: string;
    description?: string;
    submittedAt: number; // Unix epoch (ms)
    updatedAt: number;   // Unix epoch (ms)
    timeline: GrievanceTimelineEntry[];
}
