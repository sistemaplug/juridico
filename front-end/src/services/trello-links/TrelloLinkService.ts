import Http from "../Http";
import type {
  DataTrelloLink,
  NewDataTrelloLink,
  UpdateDataTrelloLink,
} from "@/types/trello-links/TrelloLinkTypes";

export class TrelloLinkService extends Http {
  constructor() {
    super("trello-links");
  }

  async create(dto: NewDataTrelloLink) {
    return await this.post<DataTrelloLink>("/register", dto);
  }

  async findByService(serviceId: string) {
    return await this.get<DataTrelloLink[]>(`/by-service/${serviceId}`);
  }

  async update(id: string, dto: UpdateDataTrelloLink) {
    return await this.patch<DataTrelloLink>(`/${id}`, dto);
  }

  async remove(id: string) {
    return await this.delete<DataTrelloLink>(`/${id}`);
  }
}
