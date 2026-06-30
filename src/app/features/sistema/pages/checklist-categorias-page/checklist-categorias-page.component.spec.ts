import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistCategoriasPageComponent } from './checklist-categorias-page.component';

describe('ChecklistCategoriasPageComponent', () => {
  let component: ChecklistCategoriasPageComponent;
  let fixture: ComponentFixture<ChecklistCategoriasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecklistCategoriasPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistCategoriasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
