import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCategorisedNewsComponent } from './public-categorised-news.component';

describe('PublicCategorisedNewsComponent', () => {
  let component: PublicCategorisedNewsComponent;
  let fixture: ComponentFixture<PublicCategorisedNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicCategorisedNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicCategorisedNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
