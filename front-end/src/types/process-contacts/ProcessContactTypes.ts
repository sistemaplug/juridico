import type { DataAddress } from "../addresses/AddressTypes";

export interface DataProcessContact {
  id: string;
  name: string;
  cpf: string | null;
  cnpj: string | null;
  email: string;
  phone_commercial: string;
  phone_personal: string;
  is_active: boolean;
  commercial_address: DataAddress;
  residential_address: DataAddress;
  created_at: string;
  updated_at: string;
}

export interface NewDataProcessContact {
  name: string;
  cpf?: string;
  cnpj?: string;
  email: string;
  phone_commercial: string;
  phone_personal: string;
  commercial_address_id: string;
  residential_address_id: string;
}

export interface UpdateDataProcessContact {
  name?: string;
  cpf?: string | null;
  cnpj?: string | null;
  email?: string;
  phone_commercial?: string;
  phone_personal?: string;
  is_active?: boolean;
  commercial_address_id?: string;
  residential_address_id?: string;
}
