import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementLoginV2Component } from './management-login-v2.component';

describe('ManagementLoginV2Component', () => {
  let component: ManagementLoginV2Component;
  let fixture: ComponentFixture<ManagementLoginV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementLoginV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementLoginV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
