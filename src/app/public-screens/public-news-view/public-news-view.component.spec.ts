import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicNewsViewComponent } from './public-news-view.component';

describe('PublicNewsViewComponent', () => {
  let component: PublicNewsViewComponent;
  let fixture: ComponentFixture<PublicNewsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicNewsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicNewsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
