import { Injectable } from '@angular/core';
import { AppServiceService } from './app-service.service';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionalityService {

  constructor(private appService:AppServiceService) { }


}
