import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-rating-bar',
  imports: [],
  templateUrl: './rating-bar.html',
  styleUrl: './rating-bar.scss',
})
export class RatingBar {
  rating = input.required<number>();

  private readonly maxRating = 10;
  private readonly circleRadius = 20;

  circumference = 2 * Math.PI * this.circleRadius;

  offset = computed(() => {
    const value = Math.max(0, Math.min(this.rating(), this.maxRating));
    return this.circumference - (value / this.maxRating) * this.circumference;
  });
}
