import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, SimpleChanges } from '@angular/core';
import { AlertService } from 'app/services/alert.service';

@Component({
  selector: 'simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss']
})
export class SimpleTableComponent implements OnInit {

  @Input() tableData:any;
  @Input() tableMetaData:any;
  @Input() paginationData:any;

  @Output() actionEmitter = new EventEmitter<any>();
  constructor(private alertService:AlertService) { }
  public totalRecords;// Set your total records count here
  public recordsPerPage;
  public currentPage;;

  ngOnInit(): void {
    console.log(this.paginationData)
    this.totalRecords = this.paginationData?.totalRecords ? this.paginationData.totalRecords : null; 
    this.recordsPerPage = this.paginationData?.recordsPerPage ? this.paginationData.recordsPerPage : 10; 
    this.currentPage = this.paginationData?.currentPage ? this.paginationData.currentPage : null; 
  }

  checkKeysPresent = (field:any) => {
    if (field){
      return Object.keys(field)
    } else {
      return []
    }
  }

  triggerAction = (type:any,data:any, rowData?:any)=>{
    let obj = { 'type': type, 'data': data };
    if(rowData){
      obj['rowData']=rowData;
    }
    if (this.checkDisabledCondition(data, rowData)){
      this.alertService.open('warning', 'Unauthorized', "You dont have access!")
      return true
    } else {
      this.actionEmitter.emit(obj);
    }

  }
  
  onPageChange(page: number): void {
    // Handle page change, fetch new records, etc.
    this.currentPage = page;
    // Call your API or update the record list accordingly
  }
  checkDisabledCondition(btnData, rowData){
    if (btnData && btnData.disable && Object.keys(btnData.disable).length>0){
      const disableKeys=Object.keys(btnData.disable)
      for (let index = 0; index < disableKeys.length; index++) {
        if (rowData[disableKeys[index]] && (btnData.disable[disableKeys[index]].includes(rowData[disableKeys[index]]))) {
          return true
        }
        
      }
     
    }
    return false;
  }

  onSelectExternalHeaderAction = (action, selectedType) => {
    let obj = {
      type:"headerActionSelect",
      action:action, 
      value:selectedType
    };
    this.actionEmitter.emit(obj);

  }
}
