import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicScreensComponent } from './public-screens.component';

describe('PublicScreensComponent', () => {
  let component: PublicScreensComponent;
  let fixture: ComponentFixture<PublicScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicScreensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
