import { Injectable } from '@angular/core';
import * as toastr from 'toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() {
    toastr.options.closeButton = true;
    toastr.options.progressBar = true;
    toastr.options.closeHtml = '<button><i class="fa fa-times-circle"></i></button>';
  }
  /**
   *
   * @param type success||error||info||warning
   * @param title title - any string
   * @param body body - any string
   */
  public open(type, title, body) {
    toastr[type](title, body);
  }
}
