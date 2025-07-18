import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactNewsCardComponent } from './compact-news-card.component';

describe('CompactNewsCardComponent', () => {
  let component: CompactNewsCardComponent;
  let fixture: ComponentFixture<CompactNewsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompactNewsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompactNewsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
