import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppServiceService } from '../../services/app-service.service';
import { AlertService } from '../../services/alert.service';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'nc-web-management-employee-tracing',
  templateUrl: './management-employee-tracing.component.html',
  styleUrl: './management-employee-tracing.component.scss'
})
export class ManagementEmployeeTracingComponent implements OnInit, AfterViewInit {
  public actions=[{'label':'Active', value:true},{'label':"In Active", value:false}]
  @ViewChild('addEmployeeTracingBtnBtn', { static: false }) addEmployeeTracingBtnBtn!: ElementRef;

  public employeeTracingList: any = {
    header: [],
    body: [],
    totalNumberOfRecords: null,
    count: 7,
    page: 1,
    tableLoaded: false,
    action: this.actions[0].value
  }
  public metaData: any = {};
  public pageNumber: any = 1;
  public listingTable: any = {};
  public employeeTracingFormValues: any = {};
  public QRLink: any = '';
  constructor(private appService: AppServiceService, private alertService: AlertService, private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    // this.getAllEmployees();
    this.getTableListing();
  }
  onAddEmployeeClick(): void {
    console.log('Add Employee button clicked!');
    this.actionEmitter({
      type: 'create'
    })
    // Your logic here
  }


  changeOfNewsType = ()=>{
    this.employeeTracingList.page=1;
    this.getTableListing()
  }
  ngAfterViewInit(): void {
    this.addEmployeeTracingBtnBtn.nativeElement.addEventListener('click', this.onAddEmployeeClick.bind(this));
  }

  onPageChangeRejectedNews = (event: any) => {
    this.employeeTracingList.page = event;
    this.getTableListing();
  }
  getAllEmployees = () => {
    try {
      this.appService.loaderService = true;
      this.appService.getAllEmployeesv2({ page: this.pageNumber }).subscribe((response) => {
        if (response.status === 'success') {
          this.metaData['employees'] = response?.data || []
          // this.employeeTables = this.employeeTablesCopy = response['data'] || [];
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }
  getTableListing = () => {
    try {
      this.appService.loaderService = true;
      this.appService.getEmployeTracingList(this.employeeTracingList).subscribe((response) => {
        if (response.status === 'success') {

          this.employeeTracingList.tableLoaded = true;
          this.employeeTracingList.header = response?.data?.tableData?.headerContent || []
          this.employeeTracingList.body = response?.data?.tableData?.bodyContent|| []
          this.employeeTracingList.metaData = response?.data?.metaData || []
          this.employeeTracingList.totalNumberOfRecords = response?.data?.totalRecords || []

          this.listingTable = { ...response['data'] || {}, currentPage: this.pageNumber };

        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }
  actionEmitter = (event: any) => {
    if (event?.type === 'create') {
      this.getAllEmployees();
      document.getElementById('addEmployeeTracingBtn')?.click()
    } else if (event?.type === 'edit') {
      this.getAllEmployees();
      this.employeeTracingFormValues = { ...event?.rowData, startDate: formatDate(event.rowData.startDate || '', 'yyyy-MM-dd', 'en-US'), endDate: formatDate(event.rowData.endDate || '', 'yyyy-MM-dd', 'en-US') } || {};
      document.getElementById('addEmployeeTracingBtn')?.click()
    } else if (event?.type === 'qrCode') {
      this.QRLink = 'https://neticharithra-ncmedia.web.app/#/yourStatus/' + event.rowData.activeTraceId;
      this.copyImageToClipboard();
    }
  }
  copyImageToClipboard() {

    const canvas = document.querySelector('canvas') as HTMLCanvasElement;

    canvas.toBlob((blob) => {
      if (blob) {
          
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;

    canvas.toBlob((blob) => {
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item]);
      this.alertService.open('success', "QR Code Copied Successfully..",'Success')
    });

     
      } else {
        this.alertService.open('error', "Failed to copy QR Code", 'Error');
      }
    });

  }
  signUpCreds = () => {


    var payload = JSON.parse(JSON.stringify(this.employeeTracingFormValues))


    if (payload['startDate']) {
      payload['startDate'] = this.datePipe.transform(payload['startDate'], 'yyyy-MM-ddTHH:mm:ssZ')
      //  this.convertToUTC(payload['startDate'])
    }
    if (payload['endDate']) {
      payload['endDate'] = this.datePipe.transform(payload['endDate'], 'yyyy-MM-ddTHH:mm:ssZ')
      // payload['endDate'] = this.convertToUTC(payload['endDate'])
    }

    this.appService.manipulateEmployeTracing({ data: payload }).subscribe((response) => {
      if (response.status === 'success') {
        this.alertService.open('success', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Success !");
        this.employeeTracingFormValues = {};
        document.getElementById('addEmployeeTracingBtn')?.click();
        this.getTableListing();
        // this.listingTable = { ...response['data'] || {}, currentPage: this.pageNumber };

      } else {
        this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
      }
      this.appService.loaderService = false;
    })
  }


}
