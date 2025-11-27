import { ProcessContactPerson } from '@prisma/client';

export class ProcessContactPersonEntity implements ProcessContactPerson {
  id: string;
  person_id: string;
  contractor_id: string;
  created_at: Date;
  updated_at: Date;
}
