import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboresPageComponent } from './labores-page.component';

describe('LaboresPageComponent', () => {
  let component: LaboresPageComponent;
  let fixture: ComponentFixture<LaboresPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboresPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboresPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
