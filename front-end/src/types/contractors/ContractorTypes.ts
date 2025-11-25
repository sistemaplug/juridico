export interface DataContractor {
  id: string;
  name: string;
  cpf: string;
  cnpj: string;
  email: string;
  phone_commercial: string;
  phone_personal: string;
  is_active: Boolean;
  // commercial_address     Address
  // residential_address    Address
  created_at: string;
  updated_at: string;
  // contracts              Contract[]
  // requirers              Requirer[]
  // services               Service[]
}

export interface NewDataContractor {
  name: string;
  cpf?: string;
  cnpj?: string;
  email: string;
  phone_commercial: string;
  phone_personal: string;
  // commercial_address     Address
  // residential_address    Address
}

export interface UpdateDataContractor {
  id?: string;
  name?: string;
  cpf?: string;
  cnpj?: string;
  email?: string;
  phone_commercial?: string;
  phone_personal?: string;
  is_active?: Boolean;
  // commercial_address     Address
  // residential_address    Address
  created_at?: string;
  updated_at?: string;
}
