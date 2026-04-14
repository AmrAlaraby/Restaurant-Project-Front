export interface BranchUser {
  id: string;
  email: string | null;
  name: string;
  role: string;
  branchId: number;
  branchName: string;
}
