import { Contractor } from '@prisma/client';

export class ContractorEntity implements Contractor {
  id: string;
  person_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
