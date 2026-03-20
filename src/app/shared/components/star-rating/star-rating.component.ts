import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1">
      @for (star of stars; track star) {
        <button
          type="button"
          (click)="onRate(star)"
          (mouseenter)="hovered.set(star)"
          (mouseleave)="hovered.set(0)"
          [disabled]="readonly()"
          class="text-2xl transition-colors"
          [class.cursor-default]="readonly()"
          [class.cursor-pointer]="!readonly()">
          <span [class]="getStarClass(star)">★</span>
        </button>
      }

      @if (showValue()) {
        <span class="ml-1 text-sm text-gray-600 font-medium">
          {{ rating() | number:'1.1-1' }}
        </span>
      }
    </div>
  `
})
export class StarRatingComponent {
  rating   = input<number>(0);
  readonly = input<boolean>(false);
  showValue = input<boolean>(false);
  ratingChange = output<number>();

  hovered = signal(0);
  stars = [1, 2, 3, 4, 5];

  onRate(value: number) {
    if (!this.readonly()) {
      this.ratingChange.emit(value);
    }
  }

  getStarClass(star: number): string {
    const active = this.hovered() || this.rating();
    return star <= active ? 'text-amber-400' : 'text-gray-300';
  }
}