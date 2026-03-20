import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyCop',
  standalone: true
})
export class CurrencyCopPipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }
}