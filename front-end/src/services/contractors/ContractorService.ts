import type {
  DataContractor,
  NewDataContractor,
  UpdateDataContractor,
} from "@/types/contractors/ContractorTypes";
import Http from "../Http";

export class ContractorService extends Http {
  constructor() {
    super("contractors");
  }

  async create(dto: NewDataContractor): Promise<DataContractor> {
    return await this.post<DataContractor>("/register", dto);
  }

  async findAll(): Promise<DataContractor[]> {
    return await this.get<DataContractor[]>("");
  }

  async findAllActive(): Promise<DataContractor[]> {
    return await this.get<DataContractor[]>("/active");
  }

  async findAllInactive(): Promise<DataContractor[]> {
    return await this.get<DataContractor[]>("/inactive");
  }

  async findById(id: string): Promise<DataContractor> {
    return await this.get<DataContractor>(`/${id}`);
  }

  async update(id: string, dto: UpdateDataContractor): Promise<DataContractor> {
    return await this.patch<DataContractor>(`/${id}`, dto);
  }

  async deactivate(id: string): Promise<DataContractor> {
    return await this.patch<DataContractor>(`/${id}/inactivate`, {});
  }
}
