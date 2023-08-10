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

  @Output() actionEmitter = new EventEmitter<any>();
  constructor(private alertService:AlertService) { }

  ngOnInit(): void {
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
}
