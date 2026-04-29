export interface BranchStockInterface {
  id: number;
  branchId: number;
  branchName?: string;
  ingredientId: number;
  ingredientName?: string;
  ingredientArabicName?: string;
  unit?: string;
  quantityAvailable: number;
  lowThreshold: number;
}