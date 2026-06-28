import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosPageComponent } from './turnos-page.component';

describe('TurnosPageComponent', () => {
  let component: TurnosPageComponent;
  let fixture: ComponentFixture<TurnosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
