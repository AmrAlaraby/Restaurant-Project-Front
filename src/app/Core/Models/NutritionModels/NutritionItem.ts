import { NutritionTotals } from "./NutritionTotals";

export interface NutritionItem {
    itemName: string;
    quantity: number;
    perItem: NutritionTotals;
    totals: NutritionTotals;
}