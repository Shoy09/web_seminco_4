import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoPerfHorizontalComponent } from './monitoreo-perf-horizontal.component';

describe('MonitoreoPerfHorizontalComponent', () => {
  let component: MonitoreoPerfHorizontalComponent;
  let fixture: ComponentFixture<MonitoreoPerfHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoreoPerfHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoreoPerfHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
