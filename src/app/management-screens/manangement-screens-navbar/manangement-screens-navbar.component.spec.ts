import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManangementScreensNavbarComponent } from './manangement-screens-navbar.component';

describe('ManangementScreensNavbarComponent', () => {
  let component: ManangementScreensNavbarComponent;
  let fixture: ComponentFixture<ManangementScreensNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManangementScreensNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManangementScreensNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
