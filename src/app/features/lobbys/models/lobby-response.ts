export interface LobbyResponse {
  id:          number;
  name:        string;
  description: string | null;
  image:       string | null;
  owner_id:    number;
  createdAt:   string;
  isOwner?:    boolean;
}

export interface LobbyMemberResponse {
  id:       number;
  lobby_id: number;
  user_id:  number;
  joinedAt: string;
}