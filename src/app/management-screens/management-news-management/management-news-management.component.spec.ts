import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementNewsManagementComponent } from './management-news-management.component';

describe('ManagementNewsManagementComponent', () => {
  let component: ManagementNewsManagementComponent;
  let fixture: ComponentFixture<ManagementNewsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagementNewsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementNewsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
