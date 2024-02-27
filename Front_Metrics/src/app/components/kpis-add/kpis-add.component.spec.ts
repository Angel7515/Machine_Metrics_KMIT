import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpisAddComponent } from './kpis-add.component';

describe('KpisAddComponent', () => {
  let component: KpisAddComponent;
  let fixture: ComponentFixture<KpisAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KpisAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KpisAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
