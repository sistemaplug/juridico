import { Contractor } from '@prisma/client';

export class ContractorEntity implements Contractor {
  id: string;
  name: string;
  cpf: string | null;
  cnpj: string | null;
  email: string;
  phone_commercial: string;
  phone_personal: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
