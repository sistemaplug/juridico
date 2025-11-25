export interface DataAddress {
  id: string;
  zipcode: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
  created_at: string;
  updated_at: string;
}

export interface NewDataAddress {
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
  zipcode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  complement?: string;
  city?: string;
  state?: string;
  created_at?: string;
  updated_at?: string;
}
