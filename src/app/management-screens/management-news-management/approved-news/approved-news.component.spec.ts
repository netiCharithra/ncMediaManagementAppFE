import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedNewsComponent } from './approved-news.component';

describe('ApprovedNewsComponent', () => {
  let component: ApprovedNewsComponent;
  let fixture: ComponentFixture<ApprovedNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovedNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
