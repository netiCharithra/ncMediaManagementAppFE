import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../../news.service';
import { CompactNewsCardComponent } from '../compact-news-card/compact-news-card.component';
import { NewsCardComponent } from '../news-card/news-card.component';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { PublicService } from '../../services/public.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  latestNews: any[] = [];
  regionalNews: any[] = [];
  internationalNews: any[] = [];
  categoryWiseNews: any[] = [];
  categoryCategorisedNews: any[] = [];
  categoryMetaList: any[] = [];

  // Loading states
  isLoadingLatestNews = true;
  isLoadingNewsTypes = true;
  isLoadingNewsCategories = true;

  latestHasMore = false;
  regionalHasMore = false;
  internationalHasMore = false;

  isMobile = window.innerWidth <= 768;

  currentLanguage: 'te' | 'en';

  constructor(private publicService: PublicService, public languageService: LanguageService) { 
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    
    this.loadLatestNews();
    this.loadNewsTypeCategorizedNews();
    this.getNewsCategoryCategorizedNews();
    this.getMetaData()
  }

  loadLatestNews(): void {
    this.isLoadingLatestNews = true;
    this.publicService.getLatestNews({})
      .subscribe({
        next: (response) => {
          this.latestNews = response || [];
        },
        error: (error) => {
          console.error('Error loading latest news:', error);
        },
        complete: () => {
          this.isLoadingLatestNews = false;
        }
      });
  }

  loadNewsTypeCategorizedNews(): void {
    this.isLoadingNewsTypes = true;
    this.publicService.getNewsTypeCategorizedNews({})
      .subscribe({
        next: (response) => {
          this.categoryWiseNews = response[0]?.['types'] || [];
        },
        error: (error) => {
          console.error('Error loading news by type:', error);
        },
        complete: () => {
          this.isLoadingNewsTypes = false;
        }
      });
  }

  getNewsCategoryCategorizedNews(): void {
    this.isLoadingNewsCategories = true;
    this.publicService.getNewsCategoryCategorizedNews({})
      .subscribe({
        next: (response) => {
          this.categoryCategorisedNews = response || [];
        },
        error: (error) => {
          console.error('Error loading news by category:', error);
        },
        complete: () => {
          this.isLoadingNewsCategories = false;
        }
      });
  }

  getMetaData(): void {
    
    this.publicService.getMetaData({ metaList: ['NEWS_CATEGORIES_REGIONAL'] })
      .subscribe(response => {
        this.categoryMetaList = response?.['NEWS_CATEGORIES_REGIONAL'] || [];
      });
  }
 
  getCategoryLabel(label:any):any {
    const found = this.categoryMetaList.find((item: any) => item.label === label);
    return found[this.currentLanguage] || label;
  }
}
