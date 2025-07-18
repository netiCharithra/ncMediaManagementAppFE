import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsExpandedComponent } from './news-expanded.component';

describe('NewsExpandedComponent', () => {
  let component: NewsExpandedComponent;
  let fixture: ComponentFixture<NewsExpandedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsExpandedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
