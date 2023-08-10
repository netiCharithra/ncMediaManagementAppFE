import { Component} from '@angular/core';
import { AppServiceService } from './services/app-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public appService:AppServiceService){

  }
}
