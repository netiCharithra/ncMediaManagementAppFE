import { Component } from '@angular/core';
import { CommonFunctionalityService } from '../../services/common-functionality.service';

@Component({
  selector: 'nc-web-manangement-screens-header',
  templateUrl: './manangement-screens-header.component.html',
  styleUrl: './manangement-screens-header.component.scss'
})
export class ManangementScreensHeaderComponent {

  constructor(public commonFucntion:CommonFunctionalityService){

  }

  callSidebarFunction() {
    this.commonFucntion.triggerSidebarFromHeader();
  }
}
