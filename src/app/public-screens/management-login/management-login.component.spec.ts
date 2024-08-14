import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementLoginComponent } from './management-login.component';

describe('ManagementLoginComponent', () => {
  let component: ManagementLoginComponent;
  let fixture: ComponentFixture<ManagementLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagementLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
