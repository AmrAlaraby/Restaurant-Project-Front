export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  branchId?: string | null;
  branchName?: string | null;
  isDeleted: boolean;
}
