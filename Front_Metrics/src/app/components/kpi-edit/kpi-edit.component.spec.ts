import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiEditComponent } from './kpi-edit.component';

describe('KpiEditComponent', () => {
  let component: KpiEditComponent;
  let fixture: ComponentFixture<KpiEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KpiEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KpiEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
