import { Requirer } from "@prisma/client";

export class RequirerEntity implements Requirer {
  id: string;
  name: string;
  cpf: string | null;
  cnpj: string | null;
  email: string;
  phone_commercial: string;
  is_active: boolean;
  contractor_id: string;
  address_id: string;
  created_at: Date;
  updated_at: Date;
}
