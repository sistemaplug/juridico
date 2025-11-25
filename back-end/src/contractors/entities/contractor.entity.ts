import { $Enums, Contractor } from '@prisma/client';

export class ContractorEntity implements Contractor {
  id: string;
  name: string;
  cpf: string | null;
  cnpj: string | null;
  email: string;
  phone_commercial: string;
  phone_personal: string;
  is_active: boolean;
  commercial_address_id: string;
  residential_address_id: string;
  created_at: Date;
  updated_at: Date;
}
