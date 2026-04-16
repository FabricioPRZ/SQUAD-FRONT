export type LobbyType    = 'CASUAL' | 'COMPETITIVE' | 'RANKED';
export type LobbyPrivacy = 'PUBLIC' | 'PRIVATE';

export interface LobbyRequest {
  name:        string;
  description?: string;
  gameId?:     number;
  lobbyType:   LobbyType;
  privacy:     LobbyPrivacy;
  maxMembers:  number;
  tags?:       string[];
  imageUrl?:   string;
}