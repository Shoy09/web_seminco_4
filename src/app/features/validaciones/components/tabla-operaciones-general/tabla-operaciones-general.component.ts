import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';

type RegistroEditable = Record<string, any>;

@Component({
  selector: 'app-tabla-operaciones-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextarea,
    CheckboxModule,
    TableModule,
  ],
  templateUrl: './tabla-operaciones-general.component.html',
  styleUrl: './tabla-operaciones-general.component.css',
})
export class TablaOperacionesGeneralComponent implements OnChanges {
  @Input() registros: RegistroEditable[] = [];
  @Output() registrosChange = new EventEmitter<RegistroEditable[]>();

  operationColumns: string[] = [];

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

  stringify(value: any): string {
    if (value == null) return '';
    return this.isObject(value) || Array.isArray(value)
      ? JSON.stringify(value, null, 2)
      : String(value);
  }
}
