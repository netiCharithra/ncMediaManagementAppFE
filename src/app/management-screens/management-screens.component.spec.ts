import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementScreensComponent } from './management-screens.component';

describe('ManagementScreensComponent', () => {
  let component: ManagementScreensComponent;
  let fixture: ComponentFixture<ManagementScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagementScreensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
