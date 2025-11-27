export enum AddressType {
  COMMERCIAL = "COMMERCIAL",
  RESIDENTIAL = "RESIDENTIAL",
  OTHER = "OTHER",
}

export interface DataAddress {
  id: string;
  person_id: string;
  type: AddressType;
  zipcode: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string | null;
  city: string;
  state: string;
  created_at: string;
  updated_at: string;
}

export interface NewDataAddress {
  person_id: string;
  type: AddressType;
  zipcode: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string | null;
  city: string;
  state: string;
}

export interface UpdateDataAddress {
  id?: string;
  person_id?: string;
  type?: AddressType;
  zipcode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  complement?: string | null;
  city?: string;
  state?: string;
  created_at?: string;
  updated_at?: string;
}
