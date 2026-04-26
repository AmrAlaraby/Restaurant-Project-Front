export interface SuggestResultDTO {
  menu_item_id: number;
  menu_item_name: string;
  match_score: number;
  matched_ingredients: string[];
  missing_ingredients: string[];
}
