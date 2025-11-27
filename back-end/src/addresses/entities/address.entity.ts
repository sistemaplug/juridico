import { $Enums, Address } from '@prisma/client';

export class AddressEntity implements Address {
  id: string;
  number: string;
  person_id: string;
  type: $Enums.AddressType;
  zipcode: string;
  street: string;
  neighborhood: string;
  complement: string | null;
  city: string;
  state: string;
  created_at: Date;
  updated_at: Date;
}
