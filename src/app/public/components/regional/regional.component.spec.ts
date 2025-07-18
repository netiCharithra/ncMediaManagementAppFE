import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionalComponent } from './regional.component';

describe('RegionalComponent', () => {
  let component: RegionalComponent;
  let fixture: ComponentFixture<RegionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
