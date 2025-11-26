import type {
  DataAddress,
  NewDataAddress,
  UpdateDataAddress,
} from "../addresses/AddressTypes";

export interface DataRequirer {
  id: string;
  name: string;
  cpf: string | null;
  cnpj: string | null;
  email: string;
  phone_commercial: string;
  is_active: boolean;
  contractor_id: string;
  address: DataAddress;
  created_at: string;
  updated_at: string;
}

export interface NewDataRequirer {
  name: string;
  cpf?: string | null;
  cnpj?: string | null;
  email: string;
  phone_commercial: string;
  contractor_id: string;
  address: NewDataAddress;
}

export interface UpdateDataRequirer {
  id?: string;
  name?: string;
  cpf?: string | null;
  cnpj?: string | null;
  email?: string;
  phone_commercial?: string;
  address?: UpdateDataAddress;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
