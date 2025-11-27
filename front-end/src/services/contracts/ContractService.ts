import type {
  DataContract,
  NewDataContract,
  UpdateDataContract,
} from "@/types/contracts/ContractTypes";
import Http from "../Http";

export class ContractService extends Http {
  constructor() {
    super("contracts");
  }

  async create(dto: NewDataContract): Promise<DataContract> {
    return await this.post<DataContract>("/register", dto);
  }

  async findAll(): Promise<DataContract[]> {
    return await this.get<DataContract[]>("");
  }

  async findByContractor(personId: string): Promise<DataContract | null> {
    return await this.get<DataContract | null>(
      `/by-contractor/${personId}`
    );
  }

  async findById(id: string): Promise<DataContract> {
    return await this.get<DataContract>(`/${id}`);
  }

  async update(id: string, dto: UpdateDataContract): Promise<DataContract> {
    return await this.patch<DataContract>(`/${id}`, dto);
  }

  async deactivate(id: string): Promise<DataContract> {
    return await this.patch<DataContract>(`/${id}/inactivate`, {});
  }
}
