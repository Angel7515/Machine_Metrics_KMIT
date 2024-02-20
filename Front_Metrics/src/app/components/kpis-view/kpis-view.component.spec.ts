import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpisViewComponent } from './kpis-view.component';

describe('KpisViewComponent', () => {
  let component: KpisViewComponent;
  let fixture: ComponentFixture<KpisViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KpisViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KpisViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
