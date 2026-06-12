import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorometrosEquipoComponent } from './horometros-equipo.component';

describe('HorometrosEquipoComponent', () => {
  let component: HorometrosEquipoComponent;
  let fixture: ComponentFixture<HorometrosEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorometrosEquipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorometrosEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
