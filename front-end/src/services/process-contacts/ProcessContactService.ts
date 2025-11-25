import type {
  DataProcessContact,
  NewDataProcessContact,
  UpdateDataProcessContact,
} from "@/types/process-contacts/ProcessContactTypes";
import Http from "../Http";

export class ProcessContactService extends Http {
  constructor() {
    super("process-contact");
  }

  async create(dto: NewDataProcessContact): Promise<DataProcessContact> {
    return await this.post<DataProcessContact>("/register", dto);
  }

  async findAll(): Promise<DataProcessContact[]> {
    return await this.get<DataProcessContact[]>("");
  }

  async findByContractor(
    contractorId: string
  ): Promise<DataProcessContact | null> {
    return await this.get<DataProcessContact | null>(
      `/by-contractor/${contractorId}`
    );
  }

  async findById(id: string): Promise<DataProcessContact> {
    return await this.get<DataProcessContact>(`/${id}`);
  }

  async update(
    id: string,
    dto: UpdateDataProcessContact
  ): Promise<DataProcessContact> {
    return await this.patch<DataProcessContact>(`/${id}`, dto);
  }

  async deactivate(id: string): Promise<DataProcessContact> {
    return await this.patch<DataProcessContact>(`/${id}/inactivate`, {});
  }
}
