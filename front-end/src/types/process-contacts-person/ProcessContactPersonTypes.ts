import type { DataPerson } from "../persons/PersonTypes";
import type { DataContractor } from "../contractors/ContractorTypes";

export interface DataProcessContactPerson {
  id: string;
  person_id: string;
  contractor_id: string;
  person: DataPerson;
  contractor: DataContractor;
  created_at: string;
  updated_at: string;
}

export interface NewDataProcessContactPerson {
  person_id: string;
  contractor_id: string;
}

export interface UpdateDataProcessContactPerson {
  id?: string;
  person_id?: string;
  contractor_id?: string;
}
