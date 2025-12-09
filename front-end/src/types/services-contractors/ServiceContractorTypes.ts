import type { DataContractor } from "../contractors/ContractorTypes";
import type { DataTrelloLink } from "../trello-links/TrelloLinkTypes";

export enum StatusService {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export interface DataService {
  id: string;
  type: string;
  status: StatusService;
  is_active: boolean;
  contractor_id: string;
  contractor: DataContractor;
  created_at: string;
  updated_at: string;
  trello_links: DataTrelloLink[];
}

export interface NewDataService {
  type: string;
  status: StatusService;
  contractor_id: string;
}

export interface UpdateDataService {
  id?: string;
  type?: string;
  status?: StatusService;
  is_active?: boolean;
  contractor_id?: string;
  created_at?: string;
  updated_at?: string;
}
