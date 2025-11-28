import type {
  DataService,
  NewDataService,
  UpdateDataService,
} from "@/types/services-contractors/ServiceContractorTypes";
import Http from "../Http";

export class Service extends Http {
  constructor() {
    super("services");
  }

  async create(dto: NewDataService): Promise<DataService> {
    return await this.post<DataService>("/register", dto);
  }

  async findAll(): Promise<DataService[]> {
    return await this.get<DataService[]>("");
  }

  async findByContractor(contractorId: string): Promise<DataService[]> {
    return await this.get<DataService[]>(`/by-contractor/${contractorId}`);
  }

  async findById(id: string): Promise<DataService> {
    return await this.get<DataService>(`/${id}`);
  }

  async update(id: string, dto: UpdateDataService): Promise<DataService> {
    return await this.patch<DataService>(`/${id}`, dto);
  }

  async deactivate(id: string): Promise<DataService> {
    return await this.patch<DataService>(`/${id}/inactivate`, {});
  }
}
