import type { DataAddress } from "../addresses/AddressTypes";

export interface DataPerson {
  id: string;
  name: string;
  cpf?: string | null;
  cnpj?: string | null;
  email?: string | null;
  phone_commercial?: string | null;
  phone_personal?: string | null;
  addresses: DataAddress[];
  address_commercial?: DataAddress | null;
  address_residential?: DataAddress | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewDataPerson {
  name: string;
  cpf?: string | null;
  cnpj?: string | null;
  email?: string | null;
  phone_commercial?: string | null;
  phone_personal?: string | null;
  // address_commercial?: DataAddress | null;
  // address_residential?: DataAddress | null;
}

export interface UpdateDataPerson {
  name?: string;
  cpf?: string | null;
  cnpj?: string | null;
  email?: string | null;
  phone_commercial?: string | null;
  phone_personal?: string | null;
  is_active?: boolean;
  // address_commercial?: DataAddress | null;
  // address_residential?: DataAddress | null;
}
