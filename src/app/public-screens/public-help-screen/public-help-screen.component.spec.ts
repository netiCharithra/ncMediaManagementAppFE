import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHelpScreenComponent } from './public-help-screen.component';

describe('PublicHelpScreenComponent', () => {
  let component: PublicHelpScreenComponent;
  let fixture: ComponentFixture<PublicHelpScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicHelpScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicHelpScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
