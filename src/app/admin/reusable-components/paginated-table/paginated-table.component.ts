import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'nc-web-paginated-table',
  templateUrl: './paginated-table.component.html',
  styleUrls: ['./paginated-table.component.scss']
})
export class PaginatedTableComponent {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() itemsPerPage: number = 10;
  @Input() metaData: any = {};
  @Input() page: number = 1;
  @Input() totalItems: number = 0;
  @Input() noRecordsMessage: string = 'No records found';

  @Output() pageChange = new EventEmitter<number>();
  @Output() actionEmitter = new EventEmitter<any>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  constructor(private messageService: MessageService, private storage: StorageService) {}

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.pageChange.emit(page);
    } else {
      this.messageService.showError('Invalid page number');
    }
  }

  checkDisabledCondition(btnData: any, rowData: any): boolean {
    if (btnData && btnData.disable && Object.keys(btnData.disable).length > 0) {
      const disableKeys = Object.keys(btnData.disable);

      for (let index = 0; index < disableKeys.length; index++) {
        if (rowData[disableKeys[index]] && (btnData.disable[disableKeys[index]].includes(rowData[disableKeys[index]]))) {
          return true;
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
      this.messageService.showError("You don't have access!");
      return true;
    } else {
      const userData = this.storage.getStoredUser();
      if (!userData['profilePicture'] || !userData['identityProof']) {
        this.messageService.showError("Please upload profile picture and identity proof in order to proceed!");
        return true;
      }
      if (!userData['identityVerificationStatus'] || (userData['identityVerificationStatus'] === 'pending')) {
        this.messageService.showError("Identity Verification Not Approved yet! Contact your superior");
        return true;
      }
      if (!userData['identityVerificationStatus'] || (userData['identityVerificationStatus'] === 'rejected')) {
        this.messageService.showError("Identity Verification failed! Reupload the documents and Contact your superior");
        return true;
      }
      this.actionEmitter.emit(obj);
      return false;
    }
  }
}
