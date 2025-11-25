export interface DataContract {
  id: string;
  contractor_id: string;
  contract_date: string;
  contract_object: string;
  service_type: string;
  channel: string;
  class: string;
  frequency: string;
  power: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewDataContract {
  contractor_id: string;
  contract_date: string;
  contract_object: string;
  service_type: string;
  channel: string;
  class: string;
  frequency: string;
  power: string;
}

export interface UpdateDataContract {
  id?: string;
  contractor_id?: string;
  contract_date?: string;
  contract_object?: string;
  service_type?: string;
  channel?: string;
  class?: string;
  frequency?: string;
  power?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
