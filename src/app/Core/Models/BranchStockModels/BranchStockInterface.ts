export interface BranchStockInterface {
  id: number;
  branchId: number;
  branchName?: string;
  ingredientId: number;
  ingredientName?: string;
  quantityAvailable: number;
  lowThreshold: number;
}