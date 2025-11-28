import type { DataContractor } from "../contractors/ContractorTypes";
import type { DataPerson } from "../persons/PersonTypes";

export interface DataRequirer {
  id: string;
  person_id: string;
  person: DataPerson;
  contractor_id: string;
  contractor: DataContractor;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface NewDataRequirer {
  person_id: string;
  contractor_id: string;
}

export interface UpdateDataRequirer {
  id?: string;
  person_id?: string;
  contractor_id?: string;
}
