import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsFrameManagementComponent } from './news-frame-management.component';

describe('NewsFrameManagementComponent', () => {
  let component: NewsFrameManagementComponent;
  let fixture: ComponentFixture<NewsFrameManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsFrameManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsFrameManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
