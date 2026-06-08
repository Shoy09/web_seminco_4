import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaDeCalorComponent } from './mapa-de-calor.component';

describe('MapaDeCalorComponent', () => {
  let component: MapaDeCalorComponent;
  let fixture: ComponentFixture<MapaDeCalorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaDeCalorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaDeCalorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
