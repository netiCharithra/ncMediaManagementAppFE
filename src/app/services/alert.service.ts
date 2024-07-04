import { Injectable } from '@angular/core';
// import * as toastr from 'toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // constructor() {
  //   toastr.options.closeButton = true;
  //   toastr.options.progressBar = true;
  //   toastr.options.closeHtml = '<button><i class="fa fa-times-circle"></i></button>';
  // }
  /**
   *
   * @param type success||error||info||warning
   * @param title title - any string
   * @param body body - any string
   */
  public open(type:any, title:any, body:any) {
    // alert(title)
    // toastr[type](title, body);
  }
}
