import { NutritionItem } from "./NutritionItem";
import { NutritionTotals } from "./NutritionTotals";

export interface NutritionResponse {
    items: NutritionItem[];
    orderTotals: NutritionTotals;
}
