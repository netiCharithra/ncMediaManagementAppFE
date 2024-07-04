import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRecordsScreenComponent } from './no-records-screen.component';

describe('NoRecordsScreenComponent', () => {
  let component: NoRecordsScreenComponent;
  let fixture: ComponentFixture<NoRecordsScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoRecordsScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoRecordsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
