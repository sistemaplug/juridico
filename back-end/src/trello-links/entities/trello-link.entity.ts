import { TrelloLink } from "@prisma/client";

export class TrelloLinkEntity implements TrelloLink {
  id: string;
  url: string;
  observation: string;
  service_id: string;
  created_at: Date;
  updated_at: Date;
}
