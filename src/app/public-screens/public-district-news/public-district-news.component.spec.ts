import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicDistrictNewsComponent } from './public-district-news.component';

describe('PublicDistrictNewsComponent', () => {
  let component: PublicDistrictNewsComponent;
  let fixture: ComponentFixture<PublicDistrictNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicDistrictNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicDistrictNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
