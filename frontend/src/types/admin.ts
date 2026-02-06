export type AdminRole = "admin" | "super_admin";

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
}
