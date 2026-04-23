export interface LobbyResponse {
  id:           number;
  name:         string;
  description:  string | null;
  image:        string | null;
  owner_id:     number;
  createdAt:    string;
  ownerUsername?: string;
  isOwner?:     boolean;
}