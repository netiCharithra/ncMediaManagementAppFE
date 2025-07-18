import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-admin-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class AdminLoaderComponent implements OnInit {
  @Input() show: boolean = false;
  loadingText: string = '';

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    // Subscribe to language changes
    this.languageService.currentLang$.subscribe(() => {
      this.updateLoadingText();
    });
    this.updateLoadingText();
  }

  private updateLoadingText() {
    const currentLang = this.languageService.getCurrentLanguage();
    this.loadingText = currentLang === 'te' ? 'లోడ్ అవుతోంది...' : 'Loading...';
  }
}
