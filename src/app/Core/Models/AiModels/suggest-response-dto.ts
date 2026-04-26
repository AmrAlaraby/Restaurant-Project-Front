import { SuggestResultDTO } from "./suggest-result-dto";

export interface SuggestResponseDTO {
  results: SuggestResultDTO[];
  total_results: number;
}
