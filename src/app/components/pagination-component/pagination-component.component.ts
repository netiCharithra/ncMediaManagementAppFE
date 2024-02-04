import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination-component',
  templateUrl: './pagination-component.component.html',
  styleUrls: ['./pagination-component.component.scss']
})
export class PaginationComponentComponent implements OnInit {
  @Input() totalRecords: number = 0;
  @Input() recordsPerPage: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChange: EventEmitter<number> = new EventEmitter();

  get pages(): number[] {
    const pageCount = Math.ceil(this.totalRecords / this.recordsPerPage);
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  changePage(page: number): void {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
