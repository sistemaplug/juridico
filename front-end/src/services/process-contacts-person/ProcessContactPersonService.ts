import type {
  DataProcessContactPerson,
  NewDataProcessContactPerson,
  UpdateDataProcessContactPerson,
} from "@/types/process-contacts-person/ProcessContactPersonTypes";
import Http from "../Http";

export class ProcessContactPersonService extends Http {
  constructor() {
    super("process-contact-person");
  }

  async create(
    dto: NewDataProcessContactPerson
  ): Promise<DataProcessContactPerson> {
    return await this.post<DataProcessContactPerson>("/register", dto);
  }

  async findAll(): Promise<DataProcessContactPerson[]> {
    return await this.get<DataProcessContactPerson[]>("");
  }

  async findByContractor(
    contractorId: string
  ): Promise<DataProcessContactPerson[]> {
    return await this.get<DataProcessContactPerson[]>(
      `/by-contractor/${contractorId}`
    );
  }

  async findById(id: string): Promise<DataProcessContactPerson> {
    return await this.get<DataProcessContactPerson>(`/${id}`);
  }

  async update(
    id: string,
    dto: UpdateDataProcessContactPerson
  ): Promise<DataProcessContactPerson> {
    return await this.patch<DataProcessContactPerson>(`/${id}`, dto);
  }

  async remove(id: string): Promise<void> {
    return await this.delete<void>(`/${id}`);
  }
}
