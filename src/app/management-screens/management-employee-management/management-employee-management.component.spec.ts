import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementEmployeeManagementComponent } from './management-employee-management.component';

describe('ManagementEmployeeManagementComponent', () => {
  let component: ManagementEmployeeManagementComponent;
  let fixture: ComponentFixture<ManagementEmployeeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagementEmployeeManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementEmployeeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
