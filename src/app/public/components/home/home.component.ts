import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../../news.service';
import { News } from '../../../interfaces/news.interface';
import { CompactNewsCardComponent } from '../compact-news-card/compact-news-card.component';
import { NewsCardComponent } from '../news-card/news-card.component';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  latestNews: News[] = [];
  regionalNews: News[] = [];
  internationalNews: News[] = [];

  latestHasMore = false;
  regionalHasMore = false;
  internationalHasMore = false;

  isMobile = window.innerWidth <= 768;

  private latestPage = 0;
  private regionalPage = 0;
  private internationalPage = 0;


  constructor(private newsService: NewsService, private publicService: PublicService) { }


  ngOnInit(): void {
    this.loadLatestNews();
    this.loadRegionalNews();
    this.loadInternationalNews();
  }



  loadLatestNews(): void {

    this.publicService.getLatestNews({})
      .subscribe(response => {
        if(response?.status === 'success'){
          
        }
          console.log("Response", response)

      });


    this.newsService.getLatestNews(this.latestPage).subscribe(result => {
      this.latestNews = this.latestPage === 0 ? result.news : [...this.latestNews, ...result.news];
      this.latestHasMore = result.hasMore;
    });
  }

  loadRegionalNews(): void {
    this.newsService.getRegionalNews(this.regionalPage).subscribe(result => {
      this.regionalNews = this.regionalPage === 0 ? result.news : [...this.regionalNews, ...result.news];
      this.regionalHasMore = result.hasMore;
    });
  }

  loadInternationalNews(): void {
    this.newsService.getInternationalNews(this.internationalPage).subscribe(result => {
      this.internationalNews = this.internationalPage === 0 ? result.news : [...this.internationalNews, ...result.news];
      this.internationalHasMore = result.hasMore;
    });
  }

  loadMoreLatest(): void {
    this.latestPage++;
    this.loadLatestNews();
  }

  loadMoreRegional(): void {
    this.regionalPage++;
    this.loadRegionalNews();
  }

  loadMoreInternational(): void {
    this.internationalPage++;
    this.loadInternationalNews();
  }

}
