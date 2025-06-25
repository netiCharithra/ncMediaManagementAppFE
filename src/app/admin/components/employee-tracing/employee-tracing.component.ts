import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MessageService } from '../../services/message.service';
import { DatePipe, formatDate } from '@angular/common';
import { StorageService } from '../../services/storage.service';

declare var bootstrap: any;

@Component({
  selector: 'app-employee-tracing',
  
  templateUrl: './employee-tracing.component.html',
  styleUrl: './employee-tracing.component.scss'
})
export class EmployeeTracingComponent implements OnInit{
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
  constructor(public adminService: AdminService, private alertService: MessageService, private datePipe: DatePipe,private storage: StorageService) {

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
      this.adminService.loaderService = true;
      const userData= this.storage.getStoredUser();
      this.adminService.getEmployeeTracingActiveEmployeeList({...userData, ...{ page: this.pageNumber, employeeId: userData.employeeId }}).subscribe((response:any) => {
        if (response) {
          this.metaData['employees'] = response || []
          // this.employeeTables = this.employeeTablesCopy = response['data'] || [];
        } 
        this.adminService.loaderService = false;
      })
    } catch (error) {
      this.adminService.loaderService = false;
      console.error(error)
    }
  }
  getTableListing = () => {
    try {
      this.adminService.loaderService = true;
      this.adminService.getEmployeTracingList(this.employeeTracingList).subscribe((response:any) => {
        if (response) {

          this.employeeTracingList.tableLoaded = true;
          this.employeeTracingList.header = response?.tableData?.headerContent || []
          this.employeeTracingList.body = response?.tableData?.bodyContent|| []
          this.employeeTracingList.metaData = response?.metaData || []
          this.employeeTracingList.totalNumberOfRecords = response?.totalRecords || []

          this.listingTable = { ...response || {}, currentPage: this.pageNumber };

        } 
        this.adminService.loaderService = false;
      })
    } catch (error) {
      this.adminService.loaderService = false;
      console.error(error)
    }
  }
  actionEmitter = (event: any) => {
    if (event?.type === 'create') {
      this.getAllEmployees();
      this.formModalShowHide('show')
    } else if (event?.type === 'edit') {
      this.getAllEmployees();
      this.employeeTracingFormValues = { ...event?.rowData, startDate: formatDate(event.rowData.startDate || '', 'yyyy-MM-dd', 'en-US'), endDate: formatDate(event.rowData.endDate || '', 'yyyy-MM-dd', 'en-US') } || {};
      this.formModalShowHide('show')
    } else if (event?.type === 'qrCode') {
      this.QRLink = 'https://neticharithra-ncmedia.web.app/#/yourStatus/' + event.rowData.activeTraceId;
      this.qrModalShowHide('show');
    }
  }
  copyImageToClipboard() {

    // const canvas = document.querySelector('canvas') as HTMLCanvasElement;

    // canvas.toBlob((blob) => {
    //   if (blob) {
          
    // const canvas = document.querySelector('canvas') as HTMLCanvasElement;

    // canvas.toBlob((blob) => {
    //   const item = new ClipboardItem({ 'image/png': blob });
    //   navigator.clipboard.write([item]);
    //   this.alertService.open('success', "QR Code Copied Successfully..",'Success')
    // });

     
    //   } else {
    //     this.alertService.open('error', "Failed to copy QR Code", 'Error');
    //   }
    // });

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

    this.adminService.manipulateEmployeTracing({ data: payload }).subscribe((response) => {
      if (response) {
        this.alertService.showInfo(response.msg || "Success !");
        this.employeeTracingFormValues = {};
        document.getElementById('closeEmployeeTracingModalBtn')?.click()
        this.getTableListing();
        // this.listingTable = { ...response['data'] || {}, currentPage: this.pageNumber };

      } else {
        this.alertService.showError(response.msg || "Failed !")
      }
      this.adminService.loaderService = false;
    })
  }

  formModalShowHide = (type: any = 'show') => {
    const modal = new bootstrap.Modal(document.getElementById('employeeTracingModal'));
    if (type === 'hide') {
      // modal.hide();
      document.getElementById('closeEmployeeTracingModalBtn')?.click()
    } else {
      modal.show();
    }
  }
  qrModalShowHide = (type: any = 'show') => {
    const modal = new bootstrap.Modal(document.getElementById('qrCodeModal'));
    if (type === 'hide') {
      // modal.hide();
      document.getElementById('closeQrCodeModalBtn')?.click()
    } else {
      modal.show();
    }
  }
}
