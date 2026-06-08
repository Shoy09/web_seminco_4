import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHoraHoraPerforacionComponent } from './dialog-hora-hora-perforacion.component';

describe('DialogHoraHoraPerforacionComponent', () => {
  let component: DialogHoraHoraPerforacionComponent;
  let fixture: ComponentFixture<DialogHoraHoraPerforacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogHoraHoraPerforacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogHoraHoraPerforacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
