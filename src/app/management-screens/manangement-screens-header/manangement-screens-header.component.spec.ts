import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManangementScreensHeaderComponent } from './manangement-screens-header.component';

describe('ManangementScreensHeaderComponent', () => {
  let component: ManangementScreensHeaderComponent;
  let fixture: ComponentFixture<ManangementScreensHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManangementScreensHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManangementScreensHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
