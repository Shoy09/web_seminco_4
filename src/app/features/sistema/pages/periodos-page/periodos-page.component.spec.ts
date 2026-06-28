import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodosPageComponent } from './periodos-page.component';

describe('PeriodosPageComponent', () => {
  let component: PeriodosPageComponent;
  let fixture: ComponentFixture<PeriodosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodosPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
