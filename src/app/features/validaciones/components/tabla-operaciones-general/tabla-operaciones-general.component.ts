import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';

type RegistroEditable = Record<string, any>;

@Component({
  selector: 'app-tabla-operaciones-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    InputTextModule,
    InputTextarea,
    TableModule,
  ],
  templateUrl: './tabla-operaciones-general.component.html',
  styleUrl: './tabla-operaciones-general.component.css',
})
export class TablaOperacionesGeneralComponent implements OnChanges {
  @Input() registros: RegistroEditable[] = [];
  @Output() registrosChange = new EventEmitter<RegistroEditable[]>();

  operationColumns: string[] = [];
  selectedRegistro: RegistroEditable | null = null;
  showEditDialog = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['registros']) {
      this.operationColumns = this.buildOperationColumns();
    }
  }

  private buildOperationColumns(): string[] {
    const keys = new Set<string>();

    for (const registro of this.registros) {
      const operacion = this.ensureOperacionObject(registro);
      Object.keys(operacion).forEach((key) => keys.add(key));
    }

    return [...keys];
  }

  ensureOperacionObject(registro: RegistroEditable): Record<string, any> {
    if (!registro['operacion'] || typeof registro['operacion'] !== 'object') {
      registro['operacion'] = {};
    }

    return registro['operacion'];
  }

  getOperationValue(registro: RegistroEditable, key: string): any {
    return this.ensureOperacionObject(registro)[key];
  }

  setOperationValue(registro: RegistroEditable, key: string, value: any): void {
    this.ensureOperacionObject(registro)[key] = value;
    this.emitChanges();
  }

  updateJsonValue(registro: RegistroEditable, key: string, value: string): void {
    try {
      this.setOperationValue(registro, key, JSON.parse(value));
    } catch {
      this.setOperationValue(registro, key, value);
    }
  }

  emitChanges(): void {
    this.registrosChange.emit(this.registros);
  }

  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  openEditDialog(registro: RegistroEditable): void {
    this.selectedRegistro = registro;
    this.showEditDialog = true;
  }

  closeEditDialog(): void {
    this.showEditDialog = false;
    this.selectedRegistro = null;
  }

  getRegistroOperacionKeys(registro: RegistroEditable | null): string[] {
    if (!registro) {
      return [];
    }

    return Object.keys(this.ensureOperacionObject(registro));
  }

  isOperativo(registro: RegistroEditable | null): boolean {
    return String(registro?.['estado'] ?? '').trim().toUpperCase() === 'OPERATIVO';
  }

  getEstadoClass(estado: unknown): string {
    const normalized = String(estado ?? '').trim().toUpperCase();

    if (normalized === 'OPERATIVO') return 'estado-badge estado-operativo';
    if (normalized === 'DEMORA') return 'estado-badge estado-demora';
    if (normalized === 'MANTENIMIENTO') return 'estado-badge estado-mantenimiento';
    if (normalized === 'FUERA DE PLAN' || normalized === 'FUERA DE PLANTA') {
      return 'estado-badge estado-fuera';
    }
    if (normalized === 'RESERVA') return 'estado-badge estado-reserva';

    return 'estado-badge estado-default';
  }

  getRegistroIdentificador(registro: RegistroEditable | null): string {
    return String(registro?.['numero'] ?? registro?.['id'] ?? '-');
  }

  stringify(value: any): string {
    if (value == null) return '';
    return this.isObject(value) || Array.isArray(value)
      ? JSON.stringify(value, null, 2)
      : String(value);
  }
}
