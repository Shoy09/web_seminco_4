import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PdfService } from '../../../services/pdf.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlanMensualService } from '../../../services/plan-mensual.service';
import { PlanMetrajeService } from '../../../services/plan-metraje.service';
import { PlanProduccionService } from '../../../services/plan-produccion.service';
import { PlanMensual } from '../../../models/plan-mensual.model';
import { PlanMetraje } from '../../../models/plan_metraje.model';
import { FechasPlanMensualService } from '../../../services/fechas-plan-mensual.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css'
})
export class FormCreateComponent implements OnInit {
  @ViewChild('laborInput') laborInput!: ElementRef;
  
  createForm!: FormGroup;
  pdfFile: File | null = null;
  
  // Datos estáticos
  meses: string[] = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL',
    'MAYO', 'JUNIO', 'JULIO', 'AGOSTO',
    'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];
  
  procesos: string[] = [
    'PERFORACIÓN TALADROS LARGOS', 
    'PERFORACIÓN HORIZONTAL', 
    'SOSTENIMIENTO', 
    'SERVICIOS AUXILIARES', 
    'CARGUÍO', 
    'ACARREO'
  ];
  
  anio: number | undefined;
  mes: string | undefined;
  
  // Datos dinámicos
  laboresFiltradas: string[] = [];
  laboresCompletas: string[] = [];
  searchTerm: string = '';
  showDropdown: boolean = false;
  selectedLabor: string = '';
  
  // Almacenamiento de datos completos
  planesMensuales: PlanMensual[] = [];
  planesMetrajes: PlanMetraje[] = [];
  planesProduccion: any[] = [];
  
  // Procesos que usan planes mensuales
  procesosMensuales = ['PERFORACIÓN HORIZONTAL', 'SOSTENIMIENTO'];
  procesosMetrajes = ['SERVICIOS AUXILIARES'];
  procesosProduccion = ['PERFORACIÓN TALADROS LARGOS', 'CARGUÍO', 'ACARREO'];

  constructor(
    private fb: FormBuilder,
    private pdfService: PdfService,
    private router: Router,
    private planMensualService: PlanMensualService,
    private planMetrajeService: PlanMetrajeService,
    private planProduccionService: PlanProduccionService,
    private fechasPlanMensualService: FechasPlanMensualService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.obtenerUltimaFecha();
    
    // Escuchar cambios en el proceso seleccionado
    this.createForm.get('proceso')?.valueChanges.subscribe(proceso => {
      this.updateLaborOptions(proceso);
      this.searchTerm = '';
      this.showDropdown = false;
    });
  }

  private initForm(): void {
    const mesActual = this.meses[new Date().getMonth()];
    this.createForm = this.fb.group({
      proceso: [this.procesos[0], Validators.required],
      mes: [mesActual, Validators.required],
      labor: ['', Validators.required],
      pdf: [null, Validators.required]
    });
  }

  obtenerUltimaFecha(): void {
    this.fechasPlanMensualService.getUltimaFecha().subscribe(
      (ultimaFecha) => {
        const anio: number | undefined = ultimaFecha.fecha_ingreso;
        const mes: string = ultimaFecha.mes;
  
        if (anio !== undefined) {
          this.anio = anio;
          this.mes = mes.trim().toUpperCase();
          this.loadInitialData(anio, this.mes);
        }
      },
      (error) => {
        console.error('Error al obtener la última fecha:', error);
      }
    );
  }

  private loadInitialData(anio: number, mes: string): void {
    this.planMensualService.getPlanMensualByYearAndMonth(anio, mes).subscribe({
      next: (data) => {
        this.planesMensuales = data;
        this.updateLaborOptions(this.createForm.get('proceso')?.value);
      },
      error: (err) => console.error('Error cargando planes mensuales:', err)
    });

    this.planMetrajeService.getPlanMensualByYearAndMonth(anio, mes).subscribe({
      next: (data) => {
        this.planesMetrajes = data;
        this.updateLaborOptions(this.createForm.get('proceso')?.value);
      },
      error: (err) => console.error('Error cargando planes de metraje:', err)
    });

    this.planProduccionService.getPlanMensualByYearAndMonth(anio, mes).subscribe({
      next: (data) => {
        this.planesProduccion = data;
        this.updateLaborOptions(this.createForm.get('proceso')?.value);
      },
      error: (err) => console.error('Error cargando planes de producción:', err)
    });
  }

  private getCurrentPlanes(): any[] {
    const proceso = this.createForm.get('proceso')?.value;
    
    if (this.procesosMensuales.includes(proceso)) {
      return this.planesMensuales;
    } else if (this.procesosMetrajes.includes(proceso)) {
      return this.planesMetrajes;
    } else if (this.procesosProduccion.includes(proceso)) {
      return this.planesProduccion;
    }
    return [];
  }

  private updateLaborOptions(proceso: string): void {
    const planes = this.getCurrentPlanes();
    
    if (planes.length === 0) {
      this.laboresCompletas = [];
      this.laboresFiltradas = [];
      return;
    }
    
    const uniqueLabores = new Set<string>();
    planes.forEach(plan => {
      if (plan.tipo_labor && plan.labor) {
        let laborCombinada = `${plan.tipo_labor} - ${plan.labor}`;
        if (plan.ala) {
          laborCombinada += ` - ${plan.ala}`;
        }
        uniqueLabores.add(laborCombinada);
      }
    });
    
    this.laboresCompletas = Array.from(uniqueLabores).sort();
    this.laboresFiltradas = [...this.laboresCompletas];
    
    if (this.laboresCompletas.length > 0) {
      const firstLabor = this.laboresCompletas[0];
      this.selectedLabor = firstLabor;
      this.createForm.patchValue({ labor: firstLabor });
    }
  }

  // Métodos para el buscador
  onSearchInput(event: any): void {
    this.searchTerm = event.target.value;
    this.showDropdown = true;
    
    if (this.searchTerm.trim() === '') {
      this.laboresFiltradas = [...this.laboresCompletas];
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.laboresFiltradas = this.laboresCompletas.filter(labor => 
      labor.toLowerCase().includes(searchTermLower)
    );
  }

  selectLabor(labor: string): void {
    this.selectedLabor = labor;
    this.searchTerm = labor;
    this.showDropdown = false;
    this.createForm.patchValue({ labor: labor });
    this.laboresFiltradas = [...this.laboresCompletas];
  }

  onInputBlur(): void {
    // Si el usuario escribió manualmente y no seleccionó de la lista
    if (this.searchTerm.trim() !== '') {
      this.createForm.patchValue({ labor: this.searchTerm.toUpperCase() });
    }
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onInputFocus(): void {
    if (this.laboresCompletas.length > 0) {
      this.showDropdown = true;
      this.laboresFiltradas = [...this.laboresCompletas];
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.pdfFile = file;
      this.createForm.patchValue({ pdf: file });
      this.createForm.get('pdf')?.setErrors(null);
    } else {
      alert('Por favor selecciona un archivo PDF válido.');
      this.createForm.get('pdf')?.setErrors({ invalidType: true });
      this.pdfFile = null;
    }
  }

  onSubmit(): void {
    if (this.createForm.invalid || !this.pdfFile) {
      this.markFormAsTouched();
      alert('Por favor completa todos los campos obligatorios y selecciona un PDF.');
      return;
    }

    const formData = this.prepareFormData();
    this.uploadPdf(formData);
  }

  private markFormAsTouched(): void {
    Object.values(this.createForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const formValues = this.createForm.value;
    
    Object.keys(formValues).forEach(key => {
      if (key !== 'pdf' && formValues[key]) {
        formData.append(key, String(formValues[key]).toUpperCase());
      }
    });
    
    if (this.pdfFile) {
      formData.append('archivo', this.pdfFile);
    }
    
    return formData;
  }

  private uploadPdf(formData: FormData): void {
    this.pdfService.createPdf(formData).subscribe({
      next: () => this.handleUploadSuccess(),
      error: (err) => this.handleUploadError(err)
    });
  }

  private handleUploadSuccess(): void {
    alert('PDF subido exitosamente.');
    this.resetForm();
  }

  private handleUploadError(error: any): void {
    console.error('Error al subir PDF:', error);
    alert('Ocurrió un error al subir el PDF. Por favor intenta nuevamente.');
  }

  public resetForm(): void {
    const mesActual = this.meses[new Date().getMonth()];
    this.createForm.reset({
      proceso: this.procesos[0],
      mes: mesActual,
      labor: ''
    });
    this.pdfFile = null;
    this.searchTerm = '';
    this.selectedLabor = '';
    this.showDropdown = false;
    this.updateLaborOptions(this.procesos[0]);
  }
}