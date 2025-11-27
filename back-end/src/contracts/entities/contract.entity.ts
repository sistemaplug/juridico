import { Contract } from '@prisma/client';

export class ContractEntity implements Contract {
  id: string;
  contractor_id: string;
  contract_date: Date;
  contract_object: string;
  service_type: string;
  channel: string;
  class: string;
  frequency: string;
  power: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

}
