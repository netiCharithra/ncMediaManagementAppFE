import { Component } from '@angular/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  
  constructor(private languageService: LanguageService) {}

  getString(key: any): string {
    return this.languageService.getString(key);
  }

  get logoPath(): string {
    return 'assets/images/logo.png';
  }
}
