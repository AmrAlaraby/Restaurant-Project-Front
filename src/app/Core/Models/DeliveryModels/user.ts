export interface User {
  id: string;
  email: string;
  name: string;
  roleId: string;
  branchId: number | null;
  branchName: string | null;
}
