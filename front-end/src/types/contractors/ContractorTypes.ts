import type { DataPerson } from "../persons/PersonTypes";

export interface DataContractor {
  id: string;
  person_id: string;
  person: DataPerson;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface NewDataContractor {
  person_id: string;
}
export interface UpdateDataContractor {
  person_id?: string;
  is_active?: boolean;
}
