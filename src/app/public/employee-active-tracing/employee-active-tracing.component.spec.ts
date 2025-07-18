import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeActiveTracingComponent } from './employee-active-tracing.component';

describe('EmployeeActiveTracingComponent', () => {
  let component: EmployeeActiveTracingComponent;
  let fixture: ComponentFixture<EmployeeActiveTracingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeActiveTracingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeActiveTracingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
