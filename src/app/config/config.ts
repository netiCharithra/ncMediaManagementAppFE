import { environment } from "../../environments/environment";

export class Config {
    public static get BASE_POINT_API(): string { return environment.base_url + 'api/v2/'; }
    public static get BASE_POINT_UPLOAD(): string { return environment.base_url_upload_files + 'api/upload/'; }
    public static API: any = {
        // MS Token Validate
        USER_LOGIN: Config.BASE_POINT_API + 'reporterLogin',
        GET_META_DATA: Config.BASE_POINT_API + 'getMetaData',
        REGISTER_EMPLOYEE: Config.BASE_POINT_UPLOAD + 'registerEmployee_v2',
        // REGISTER_EMPLOYEE: Config.BASE_POINT_API + 'registerEmployee',
        GET_SUBSCRIBERS: Config.BASE_POINT_API + 'getSubscribers',
        ADD_SUBSCRIBERS: Config.BASE_POINT_API + 'addSubscribers',
        ADD_SUBSCRIBER_TO_GROUP: Config.BASE_POINT_API + 'addSubscriberToGroup',
        FETCH_DASHBOARD: Config.BASE_POINT_API + 'fetchDashboard',
        GET_NEW_REPORT_CHART: Config.BASE_POINT_API + 'newsReportChart',
        GET_OVERALL_NEWS_REPORT: Config.BASE_POINT_API + 'overallNewsReport',
        GET_EMPLOYEES_ACTIVE_COUNT: Config.BASE_POINT_API + 'getEmployeeActiveCount',
        FETCH_PENDING_LIST: Config.BASE_POINT_API + 'fetchNewsListPending',
        FETCH_APPROVED_LIST: Config.BASE_POINT_API + 'fetchNewsListApproved',
        FETCH_REJECTED_LIST: Config.BASE_POINT_API + 'fetchNewsListRejected',
        FEtCH_EMPLOYEE_LIST_V2: Config.BASE_POINT_API + 'getEmployeesDataV2',
        EMPLOYEES_DATA: Config.BASE_POINT_API + 'getEmployeesData',
        MANIPULATE_EMPLOYEE: Config.BASE_POINT_API + 'manipulateEmployee',
        EMPLOYEE_DATA: Config.BASE_POINT_API + 'getEmployeeData',
        GET_NEWS_LIST: Config.BASE_POINT_API + 'getNewsList',
        GET_ALL_EMPLOYEES: Config.BASE_POINT_API + 'getAllEmployees',
        GET_ALL_EMPLOYEES_V2: Config.BASE_POINT_API + 'getAllEmployeesV2',
        MANIPULATE_NEWS: Config.BASE_POINT_API + 'manipulateNews',
        UPLOAD_FILES: Config.BASE_POINT_API + 'uploadFiles',
        DELETES3IMAGES: Config.BASE_POINT_API + 'deleteUploadedImagess3',
        // UPLOAD_FILES: Config.BASE_POINT_UPLOAD + 'uploadFiles',
        GET_NEWS_INFO: Config.BASE_POINT_API + 'getNewsInfo',
        GET_HOME_DATA: Config.BASE_POINT_API + 'public/getHomeDataV2',
        GET_HOME_DATA_V2_NEWSTYPE: Config.BASE_POINT_API + 'public/getHomeDataV2_NEWSTYPE',
        GET_HOME_DATA_V2_CATEGORY_WISE: Config.BASE_POINT_API + 'public/getHomeDataV2CategoryWise',
        GET_DISTRICT_NEWS: Config.BASE_POINT_API + 'public/getDistrictNews',
        GET_PUBLIC_NEWS_INFO: Config.BASE_POINT_API + 'public/getNewsInfo',
        GET_PUBLIC_CATEGORY_NEWS: Config.BASE_POINT_API + 'public/getCategoryNews',
        GET_NEWS_BY_NEWS_TYPE: Config.BASE_POINT_API + 'public/getNewsNewsType',
        SET_FCM_TOKEN: Config.BASE_POINT_API + 'public/setFCMToken',
        GET_HELP_TEAM: Config.BASE_POINT_API + 'public/getHelpTeam',


        EMPLOYEE_TRACING_LIST: Config.BASE_POINT_API + 'public/employeeTracingListing',
        MANIPULATE_EMPLOYEE_TRACING: Config.BASE_POINT_API + 'public/employeeTracingManagement',
        EMPLOYEE_TRACING_CHECK: Config.BASE_POINT_API + 'public/employeeTraceCheck',

    }
}