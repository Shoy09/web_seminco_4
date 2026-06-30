import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorometrosPageComponent } from './horometros-page.component';

describe('HorometrosPageComponent', () => {
  let component: HorometrosPageComponent;
  let fixture: ComponentFixture<HorometrosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorometrosPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorometrosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
