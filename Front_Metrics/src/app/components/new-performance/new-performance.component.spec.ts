import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPerformanceComponent } from './new-performance.component';

describe('NewPerformanceComponent', () => {
  let component: NewPerformanceComponent;
  let fixture: ComponentFixture<NewPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
