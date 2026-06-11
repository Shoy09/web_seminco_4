import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosReporteComponent } from './filtros-reporte.component';

describe('FiltrosReporteComponent', () => {
  let component: FiltrosReporteComponent;
  let fixture: ComponentFixture<FiltrosReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosReporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
