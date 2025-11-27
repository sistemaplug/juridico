import { Person } from '@prisma/client';

export class PersonEntity implements Person {
  id: string;
  name: string;
  cpf: string | null;
  cnpj: string | null;
  email: string | null;
  phone_commercial: string | null;
  phone_personal: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
