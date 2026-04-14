import { BranchStock } from "./branch-stock";
import { BranchTable } from "./branch-table";
import { BranchUser } from "./branch-user";

export interface GetBranch {
  id: number;
  name: string;
  phone: string;
  isActive: boolean;
  buildingNumber: number;
  street: string;
  city: string;
  note?: string | null;
  specialMark?: string | null;
  usersCount: number;
  tablesCount: number;
  users: BranchUser[];
  branchStocks: BranchStock[];
  tables: BranchTable[];
}
