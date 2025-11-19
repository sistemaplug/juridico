import { $Enums, Service } from "@prisma/client";

export class ServicesContractorEntity implements Service {
  id: string;
  type: string;
  status: $Enums.StatusService;
  is_active: boolean;
  contractor_id: string;
  created_at: Date;
  updated_at: Date;
}
