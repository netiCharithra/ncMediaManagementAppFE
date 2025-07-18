import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language.service';
import { PublicService } from '../../services/public.service';
import { response } from 'express';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  visitorCount: number = 0;  
  constructor(private languageService: LanguageService, private publicService: PublicService) {}

  getString(key: any): string {
    return this.languageService.getString(key);
  }

  get logoPath(): string {
    return 'assets/images/logo.png';
  }

  ngOnInit(): void {
    this.getVisitorCount();
  }
  getVisitorCount(): void {
    
    this.publicService.getVisitorCount()
      .subscribe(response => {
        console.log(response,'visitor')
        if (response) {
          this.visitorCount = response  || 0;
          }
        });
  }
}
