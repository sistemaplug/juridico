import Http from "../Http";
import type {
  DataAddress,
  NewDataAddress,
  UpdateDataAddress,
} from "@/types/addresses/AddressTypes";

export class AddressService extends Http {
  constructor() {
    super("/addresses");
  }

  async create(dto: NewDataAddress): Promise<DataAddress> {
    return await this.post("/register", dto);
  }

  async findAll(): Promise<DataAddress[]> {
    return await this.get<DataAddress[]>("");
  }

  async findById(id: string): Promise<DataAddress> {
    return await this.get(`/${id}`);
  }

  async update(id: string, dto: UpdateDataAddress): Promise<DataAddress> {
    return await this.patch(`/${id}`, dto);
  }

  async remove(id: string): Promise<DataAddress> {
    return await this.delete(`/${id}`);
  }
}
