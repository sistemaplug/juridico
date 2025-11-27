import type { DataPerson, NewDataPerson, UpdateDataPerson } from "@/types/persons/PersonTypes";
import Http from "../Http";


export class PersonService extends Http {
  constructor() {
    super("persons");
  }

  async create(dto: NewDataPerson): Promise<DataPerson> {
    return await this.post<DataPerson>("/register", dto);
  }

  async findAll(): Promise<DataPerson[]> {
    return await this.get<DataPerson[]>("");
  }

  async findAllActive(): Promise<DataPerson[]> {
    return await this.get<DataPerson[]>("/active");
  }

  async findAllInactive(): Promise<DataPerson[]> {
    return await this.get<DataPerson[]>("/inactive");
  }

  async findById(id: string): Promise<DataPerson> {
    return await this.get<DataPerson>(`/${id}`);
  }

  async update(id: string, dto: UpdateDataPerson): Promise<DataPerson> {
    return await this.patch<DataPerson>(`/${id}`, dto);
  }

  async deactivate(id: string): Promise<DataPerson> {
    return await this.patch<DataPerson>(`/${id}/inactivate`, {});
  }
}
