import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourStatusComponent } from './your-status.component';

describe('YourStatusComponent', () => {
  let component: YourStatusComponent;
  let fixture: ComponentFixture<YourStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YourStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
