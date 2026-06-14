import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.css'
})
export class ResumenComponent implements OnChanges {

  @Input() data: { label: string; value: number }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {

    }
  }
}