import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpisPerformanceComponent } from './kpis-performance.component';

describe('KpisPerformanceComponent', () => {
  let component: KpisPerformanceComponent;
  let fixture: ComponentFixture<KpisPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KpisPerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KpisPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
