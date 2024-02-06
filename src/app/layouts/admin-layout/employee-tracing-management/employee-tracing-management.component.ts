import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';
import html2canvas from 'html2canvas';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'employee-tracing-management',
  templateUrl: './employee-tracing-management.component.html',
  styleUrls: ['./employee-tracing-management.component.scss'],
  providers: [DatePipe]

})
export class EmployeeTracingManagementComponent implements OnInit {

  public listingTable:any={};
  public pageNumber:any=1;
  public employeeTracingFormValues = {};
  public metaData = {};
  public tableMetaData = {};
  public QRLink:any='';
  @ViewChild('qrCodeImage') qrCodeImage!: ElementRef<HTMLImageElement>;

  constructor(private appService: AppServiceService, private alertService: AlertService, private datePipe: DatePipe, private clipboardService: ClipboardService) { }

  public  today = new Date().toISOString().split('T')[0];


  ngOnInit(): void {
    // this.getAllEmployees();
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


  copyImageToClipboard(   ) {
    
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;

    canvas.toBlob((blob) => {
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item]);
      this.alertService.open('success', "QR Code Copied Successfully..",'Success')
    });
  }


  getTableListing = () => {
    try {
      this.appService.loaderService = true;
      this.appService.getEmployeTracingList({}).subscribe((response) => {
        if (response.status === 'success') {
          this.listingTable = { ...response['data'] || {}, currentPage : this.pageNumber};

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
  signUpCreds = () =>{


    var payload = JSON.parse(JSON.stringify(this.employeeTracingFormValues))


    if(payload['startDate']){
      payload['startDate'] = this.datePipe.transform(payload['startDate'], 'yyyy-MM-ddTHH:mm:ssZ')
      //  this.convertToUTC(payload['startDate'])
    }
    if(payload['endDate']){
      payload['endDate'] = this.datePipe.transform(payload['endDate'], 'yyyy-MM-ddTHH:mm:ssZ')
      // payload['endDate'] = this.convertToUTC(payload['endDate'])
    }

    this.appService.manipulateEmployeTracing({data:payload}).subscribe((response) => {
      if (response.status === 'success') {
        this.alertService.open('success', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Success !");
        this.employeeTracingFormValues={};
        document.getElementById('addEmployeeBtn').click();
        this.getTableListing();
        // this.listingTable = { ...response['data'] || {}, currentPage: this.pageNumber };

      } else {
        this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
      }
      this.appService.loaderService = false;
    })
  }

  actionEmitter = (event) => {
    if(event?.type === 'create'){
      this.getAllEmployees();
      document.getElementById('addEmployeeBtn').click()
    } else if(event?.type === 'edit'){
      this.getAllEmployees();
      this.employeeTracingFormValues = { ...event?.rowData, startDate: formatDate(event.rowData.startDate || '', 'yyyy-MM-dd', 'en-US'), endDate: formatDate(event.rowData.endDate || '', 'yyyy-MM-dd', 'en-US') } || {};
      document.getElementById('addEmployeeBtn').click()
    } else if(event?.type === 'qrCode'){
      this.QRLink = 'https://neticharithra-ncmedia.web.app/#/yourStatus/' + event.rowData.activeTraceId;
      this.copyImageToClipboard();
    }
  }


  convertToUTC(dateString: string): string {
    const dateObject = new Date(dateString);
    return this.datePipe.transform(dateObject, 'yyyy-MM-ddTHH:mm:ssZ');
  }
}
