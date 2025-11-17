import { $Enums, User } from '@prisma/client';

export class UserEntity implements User {
  name: string;
  id: string;
  email: string;
  password: string;
  role: $Enums.Role;
  avatar_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
