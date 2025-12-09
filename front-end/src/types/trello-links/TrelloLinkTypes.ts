export interface DataTrelloLink {
  id: string;
  url: string;
  observation: string;
  service_id: string;
  created_at: string;
  updated_at: string;
}

export interface NewDataTrelloLink {
  url: string;
  observation: string;
  service_id: string;
}

export interface UpdateDataTrelloLink {
  url?: string;
  observation?: string;
}
