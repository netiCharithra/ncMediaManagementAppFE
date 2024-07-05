import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicScreensModule } from './public-screens/public-screens.module';
import { BrowserModule, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AppServiceService } from './services/app-service.service';

@Component({
  selector: 'app-root',
  // standalone: true,
  // imports: [RouterOutlet, PublicScreensModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Neti Charithra';

  constructor(private translate:TranslateService, public appService:AppServiceService, private titleService:Title){
    translate.setDefaultLang('te');
    translate.use('te');
    // this.titleService.setTitle(newTitle);
    this.translate.get('title').subscribe((translatedTitle: string) => {
      // console.log("translatedTitle", translatedTitle)
      this.titleService.setTitle(translatedTitle);
    });

  }
}
