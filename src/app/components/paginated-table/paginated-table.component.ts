import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';

interface Column {
  key: string;
  label: string;
}
@Component({
  selector: 'nc-web-paginated-table',
  templateUrl: './paginated-table.component.html',
  styleUrl: './paginated-table.component.scss'
})
export class PaginatedTableComponent {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() itemsPerPage: number = 10;
  @Input() metaData: any = {};
  @Input() page: number = 1;
  @Input() totalItems: number = 0;
  @Input() noRecordsMessage: string = '';

  @Output() pageChange = new EventEmitter<number>();
  @Output() actionEmitter = new EventEmitter<any>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  constructor(private alertService:AlertService, private storage:StorageService){}

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
  checkDisabledCondition(btnData:any, rowData:any){
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
  triggerAction = (type: any, data: any, rowData?: any): boolean => {
    let obj: any = { 'type': type, 'data': data };
    if (rowData) {
      obj['rowData'] = rowData;
    }
    if (this.checkDisabledCondition(data, rowData)) {
      this.alertService.open('warning', 'Unauthorized', "You don't have access!");
      return true;  // Returns true when unauthorized
    } else {

      const userData = this.storage.api.session.get('userData');

      if (!userData['profilePicture'] || !userData['identityProof']) {
        this.alertService.open('error', 'Verification pending..!', "Please upload profile picture and identity proof in order to proceed..!")
        return true
      }

      if (!userData['identityVerificationStatus'] || (userData['identityVerificationStatus'] === 'pending')) {
        this.alertService.open('error', 'Verification pending..!', "Identity Verification Not Approved yet..! Contact your supirior")
        return true
      }
      if (!userData['identityVerificationStatus'] || (userData['identityVerificationStatus'] === 'rejected')) {
        this.alertService.open('error', 'Identity Verification Error..!', "Identity Verification failed..! Reupload the documents and Contact your supirior")
        return true
      }
      this.actionEmitter.emit(obj);
      return false;  // Returns false when action is emitted
    }
  }
  
}
