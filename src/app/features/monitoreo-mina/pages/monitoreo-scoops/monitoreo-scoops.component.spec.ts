import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoScoopsComponent } from './monitoreo-scoops.component';

describe('MonitoreoScoopsComponent', () => {
  let component: MonitoreoScoopsComponent;
  let fixture: ComponentFixture<MonitoreoScoopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoreoScoopsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoreoScoopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
