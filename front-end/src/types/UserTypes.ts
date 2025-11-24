export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  SUPPORT = "SUPPORT",
}

export interface DataUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewDataUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar_url?: string;
}

export interface UpdateDataUser {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar_url?: string;
  role?: Role;
}
