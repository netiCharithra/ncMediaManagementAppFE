import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTracingComponent } from './employee-tracing.component';

describe('EmployeeTracingComponent', () => {
  let component: EmployeeTracingComponent;
  let fixture: ComponentFixture<EmployeeTracingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTracingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTracingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
