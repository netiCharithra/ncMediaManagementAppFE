import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedNewsComponent } from './rejected-news.component';

describe('RejectedNewsComponent', () => {
  let component: RejectedNewsComponent;
  let fixture: ComponentFixture<RejectedNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectedNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
