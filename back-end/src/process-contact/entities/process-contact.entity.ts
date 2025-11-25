import { ProcessContact } from '@prisma/client';

export class ProcessContactEntity implements ProcessContact {
  id: string;
  name: string;
  cpf: string | null;
  cnpj: string | null;
  email: string;
  phone_commercial: string;
  phone_personal: string;
  is_active: boolean;
  contractor_id: string;
  commercial_address_id: string;
  residential_address_id: string;
  created_at: Date;
  updated_at: Date;
}
