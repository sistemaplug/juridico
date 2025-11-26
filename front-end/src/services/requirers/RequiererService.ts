import type {
  DataRequirer,
  NewDataRequirer,
  UpdateDataRequirer,
} from "@/types/requirers/RequirerTypes";
import Http from "../Http";

export class RequiererService extends Http {
  constructor() {
    super("requirers");
  }

  async create(dto: NewDataRequirer): Promise<DataRequirer> {
    return await this.post<DataRequirer>("/register", dto);
  }

  async findAll(): Promise<DataRequirer[]> {
    return await this.get<DataRequirer[]>("");
  }

  async findByContractor(contractorId: string): Promise<DataRequirer> {
    return await this.get<DataRequirer>(`/by-contractor/${contractorId}`);
  }

  async findById(id: string): Promise<DataRequirer> {
    return await this.get<DataRequirer>(`/${id}`);
  }

  async update(id: string, dto: UpdateDataRequirer): Promise<DataRequirer> {
    return await this.patch<DataRequirer>(`/${id}`, dto);
  }

  async deactivate(id: string): Promise<DataRequirer> {
    return await this.get<DataRequirer>(`/${id}/inactivate`, {});
  }
}
