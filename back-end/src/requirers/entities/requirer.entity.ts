import { Requirer } from '@prisma/client';

export class RequirerEntity implements Requirer {
  id: string;
  contractor_id: string;
  person_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
