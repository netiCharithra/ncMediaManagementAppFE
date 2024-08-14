import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementEmployeeTracingComponent } from './management-employee-tracing.component';

describe('ManagementEmployeeTracingComponent', () => {
  let component: ManagementEmployeeTracingComponent;
  let fixture: ComponentFixture<ManagementEmployeeTracingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagementEmployeeTracingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementEmployeeTracingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
