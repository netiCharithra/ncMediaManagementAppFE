import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../../news.service';
import { News } from '../../../interfaces/news.interface';
import { CompactNewsCardComponent } from '../compact-news-card/compact-news-card.component';
import { NewsCardComponent } from '../news-card/news-card.component';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

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

  // Carousel related properties
  images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/900/500`);
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

  constructor(private newsService: NewsService) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnInit(): void {
    this.loadLatestNews();
    this.loadRegionalNews();
    this.loadInternationalNews();
  }

  loadLatestNews(): void {
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

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (
      this.unpauseOnArrow &&
      slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
    ) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }
}
