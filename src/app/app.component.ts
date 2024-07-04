import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicScreensModule } from './public-screens/public-screens.module';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  // standalone: true,
  // imports: [RouterOutlet, PublicScreensModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ncMediaManagementAppFE';

  constructor(private translate:TranslateService){
    translate.setDefaultLang('te');
    translate.use('te');
  }
}
