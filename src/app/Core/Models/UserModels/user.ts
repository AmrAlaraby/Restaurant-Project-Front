export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  branchId?: number | null;
  branchName?: string | null;
  branchArabicName?: string | null;
  isDeleted: boolean;
}
