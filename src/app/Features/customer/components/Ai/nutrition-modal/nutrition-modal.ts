import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DecimalPipe } from '@angular/common';


import { NutritionService } from '../../../../../Core/Services/Ai-Service/NutritionServices/nutrition-ai-service';
import { NutritionItem } from '../../../../../Core/Models/NutritionModels/NutritionItem';
import { NutritionResponse } from '../../../../../Core/Models/NutritionModels/NutritionResponse';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-nutrition-modal',
  standalone: true, // ✅ مهم
  imports: [DecimalPipe,TranslatePipe],
  templateUrl: './nutrition-modal.html',
  styleUrl: './nutrition-modal.scss',
})
export class NutritionModal implements  OnDestroy {


  Math = Math;

  // basketId: string = '';

  // ── State ──────────────────────────────────────────────────────────────────
  isLoading = false;
  isVisible = false;
  errorMsg = '';
  result: NutritionResponse | null = null;

  private destroy$ = new Subject<void>();

  constructor(private nutritionService: NutritionService) { }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  @Input() basketId: string = '';
  @Input() hasItems: boolean = false;
  @Input() items: any[] = [];

  private lastHash: string = '';

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  open(): void {

    if (!this.basketId) {
      this.errorMsg = 'No basket found.';
      this.isVisible = true;
      return;
    }

    if (!this.hasItems) {
      this.errorMsg = '🛒 Your cart is empty. Add items first!';
      this.isVisible = true;
      return;
    }

    this.isVisible = true;

    const currentHash = this.generateHash(this.items || []);

    
    if (currentHash !== this.lastHash) {
      this.result = null;
      this.lastHash = currentHash;
    }
    this.errorMsg = '';

    if (!this.result) {
      this.fetchNutrition();
    }
  }

  close(): void {
    this.isVisible = false;
  }

  retry(): void {

    if (!this.basketId) {
      this.errorMsg = 'No basket found.';
      return;
    }

    if (!this.hasItems) {
      this.errorMsg = 'Please add items to your cart first.';
      return;
    }

    this.result = null;
    this.errorMsg = '';
    this.fetchNutrition();
  }

  private generateHash(items: any[]): string {
    return JSON.stringify(
      items.map(i => ({
        id: i.id,
        qty: i.quantity
      }))
    );
  }

  // ── Core Logic (UNCHANGED ) ──────────────────────────────────────────────

  private fetchNutrition(): void {
    if (!this.basketId) {
      this.errorMsg = 'No basket found';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.nutritionService
      .calculateNutrition(this.basketId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.result = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;

          if (err.status === 404) {
            this.errorMsg = 'Basket not found. Please refresh the page.';
          } else if (err.status === 400) {
            this.errorMsg = 'Your basket is empty.';
          } else if (err.status === 502 || err.status === 503) {
            this.errorMsg = 'AI service is temporarily unavailable. Please try again.';
          } else {
            this.errorMsg = 'Something went wrong. Please try again.';
          }
        }
      });
  }

  // ── UI Helpers ─────────────────────────────────────────────────────────────

  calorieProgress(item: NutritionItem): number {
    if (!this.result) return 0;

    const total = this.result.orderTotals.calories;
    if (total === 0) return 0;

    return Math.min((item.totals.calories / 2000) * 100, 100);
  }

  getCaloriesDV(r: NutritionResponse): number {
    return Math.min((r.orderTotals.calories / 2000) * 100, 100);
  }

  getProteinDV(r: NutritionResponse): number {
    return Math.min((r.orderTotals.protein / 50) * 100, 100);
  }

  getCarbsDV(r: NutritionResponse): number {
    return Math.min((r.orderTotals.carbs / 300) * 100, 100);
  }
}