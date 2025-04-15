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

  latestHasMore = false;
  regionalHasMore = false;
  internationalHasMore = false;

  isMobile = window.innerWidth <= 768;


  public categoryWiseNews:any[]=[];
  public categoryCategorisedNews:any[]=[];
  public categoryMetaList:any[]=[];

  currentLanguage: 'en' | 'te';

  constructor(private newsService: NewsService, private publicService: PublicService, public languageService:LanguageService) { 
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }


  ngOnInit(): void {
    
    this.loadLatestNews();
    this.loadNewsTypeCategorizedNews();
    this.getNewsCategoryCategorizedNews();
    this.getMetaData()
  }



  loadLatestNews(): void {

    this.publicService.getLatestNews({})
      .subscribe(response => {
        this.latestNews = response ||[];
      });

  }
  loadNewsTypeCategorizedNews(): void {

    this.publicService.getNewsTypeCategorizedNews({})
      .subscribe(response => {
        this.categoryWiseNews=response[0]?.['types'] || []
        console.log("loadNewsTypeCategorizedNews",response)
      });

  }
  getNewsCategoryCategorizedNews(): void {

    this.publicService.getNewsCategoryCategorizedNews({})
      .subscribe(response => {
        this.categoryCategorisedNews=response|| []
        console.log("getNewsCategoryCategorizedNews",response)
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
