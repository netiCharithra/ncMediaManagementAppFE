import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { NewsItem } from '../../../types/news.types';
import { PaginationState } from '../../../types/pagination.types';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {
  type: string = '';
  newsList: NewsItem[] = [];
  pagination: PaginationState = {
    page: 1,
    count: 12,
    endOfRecords: false,
    loading: false
  };
  isMobile: boolean = window.innerWidth <= 768;

  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService
  ) {}

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000 && !this.pagination.loading && !this.pagination.endOfRecords) {
      this.loadMore();
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.type = params['type'];
      this.resetPagination();
      this.loadNews();
    });
  }

  resetPagination() {
    this.pagination = {
      page: 1,
      count: 12,
      endOfRecords: false,
      loading: false
    };
    this.newsList = [];
  }

  loadNews() {
    if (this.pagination.loading || this.pagination.endOfRecords) return;
    
    this.pagination.loading = true;
    this.publicService.getNewsTypeCategorizedNews({
      type: this.type,
      page: this.pagination.page,
      size: this.pagination.count
    }).subscribe({
      next: (response: any) => {
        if (response?.data?.length) {
          this.newsList = [...this.newsList, ...response.data];
          this.pagination.endOfRecords = response.data.length < this.pagination.count;
          this.pagination.page++;
        } else {
          this.pagination.endOfRecords = true;
        }
        this.pagination.loading = false;
      },
      error: () => {
        this.pagination.loading = false;
        this.pagination.endOfRecords = true;
      }
    });
  }

  loadMore() {
    this.loadNews();
  }
}
