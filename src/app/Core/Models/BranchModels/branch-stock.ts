export interface BranchStock {
  id: number;
  branchId: number;
  branchName: string;
  ingredientId: number;
  ingredientName: string | null;
  quantityAvailable: number;
  lowThreshold: number;
}
