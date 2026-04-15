import { LobbyType, LobbyPrivacy } from './lobby-request';

export interface LobbyResponse {
  id:            number;
  name:          string;
  description:   string | null;
  imageUrl:      string | null;
  lobbyType:     LobbyType;
  privacy:       LobbyPrivacy;
  maxMembers:    number;
  memberCount:   number;
  tags:          string[] | null;
  gameName:      string | null;
  ownerUsername: string;
  createdAt:     string;
  isOwner?:      boolean;
}