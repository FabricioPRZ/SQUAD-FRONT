import { Injectable } from '@angular/core';
import { Lobby } from '../components/lobby-card/lobby-card.component';

export interface Member {
  id: string;
  nickname: string;
  avatarUrl?: string;
  role: 'owner' | 'member';
  joinedAt: Date;
}

export interface LobbyWithMembers extends Lobby {
  members: Member[];
}

@Injectable({ providedIn: 'root' })
export class LobbyService {

  private lobbies: LobbyWithMembers[] = [
    {
      id: '1', name: 'Doomeros', description: 'Para los verdaderos slayers del infierno',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/5/57/Doom_cover_art.jpg',
      memberCount: 1160, maxPlayers: 2000, isOwner: true, tags: ['Competitivo', 'Casual'],
      members: [
        { id: 'u1', nickname: '00ShadowBlade', role: 'owner', joinedAt: new Date('2024-01-01') },
        { id: 'u2', nickname: '#DarkRift', role: 'member', joinedAt: new Date('2024-01-05') },
        { id: 'u3', nickname: 'AlphaWolf_99', role: 'member', joinedAt: new Date('2024-01-10') },
        { id: 'u4', nickname: 'BloodRaven', role: 'member', joinedAt: new Date('2024-01-15') },
        { id: 'u5', nickname: '1337_Slayer', role: 'member', joinedAt: new Date('2024-02-01') },
        { id: 'u6', nickname: 'CyberGhost_X', role: 'member', joinedAt: new Date('2024-02-10') },
        { id: 'u7', nickname: 'Demonhunter_Z', role: 'member', joinedAt: new Date('2024-03-01') },
        { id: 'u8', nickname: '42Phoenix', role: 'member', joinedAt: new Date('2024-03-05') },
        { id: 'u9', nickname: 'EchoBurst', role: 'member', joinedAt: new Date('2024-03-20') },
        { id: 'u10', nickname: '!QuakeKing', role: 'member', joinedAt: new Date('2024-04-01') },
      ]
    },
    {
      id: '2', name: 'ARK Survivors', description: 'Sobrevive o muere en el pasado',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/32/ARK-_Survival_Evolved_cover.jpg/250px-ARK-_Survival_Evolved_cover.jpg',
      memberCount: 1160, maxPlayers: 2000, isOwner: true, tags: ['Ranked', 'Práctica'],
      members: [
        { id: 'u11', nickname: 'ZeroTribe', role: 'owner', joinedAt: new Date('2024-01-01') },
        { id: 'u12', nickname: '3DinoPunch', role: 'member', joinedAt: new Date('2024-01-08') },
        { id: 'u13', nickname: 'AcidRex', role: 'member', joinedAt: new Date('2024-01-20') },
        { id: 'u14', nickname: 'BeastTamer_7', role: 'member', joinedAt: new Date('2024-02-05') },
      ]
    },
    {
      id: '3', name: 'Fortniteros Irapuato', description: 'El mejor squad del bajío',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Simple_Fortnite_Logo.svg/250px-Simple_Fortnite_Logo.svg.png',
      memberCount: 1160, maxPlayers: 2000, isOwner: false, tags: ['Amistoso'],
      members: []
    },
    {
      id: '4', name: 'Cyber Punketos', description: 'Night City o la muerte',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg',
      memberCount: 1160, maxPlayers: 2000, isOwner: false, tags: ['Roleplay', 'Casual'],
      members: []
    },
    {
      id: '5', name: 'FF7 Fans', description: 'El mejor JRPG de la historia',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg',
      memberCount: 856, maxPlayers: 1000, isOwner: true, tags: ['Casual', 'Roleplay'],
      members: [
        { id: 'u20', nickname: '7thHeaven_Tifa', role: 'owner', joinedAt: new Date('2024-01-01') },
        { id: 'u21', nickname: 'AerithReborn', role: 'member', joinedAt: new Date('2024-02-01') },
        { id: 'u22', nickname: '0CloudStrife', role: 'member', joinedAt: new Date('2024-02-15') },
        { id: 'u23', nickname: 'BusterSword88', role: 'member', joinedAt: new Date('2024-03-01') },
        { id: 'u24', nickname: 'CaitSith_Moogle', role: 'member', joinedAt: new Date('2024-03-10') },
      ]
    },
    {
      id: '6', name: 'Halo Legends', description: 'Los Spartans no mueren',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/92/Halo_4_box_art.png',
      memberCount: 420, maxPlayers: 500, isOwner: false, tags: ['Competitivo', 'Ranked'],
      members: []
    }
  ];

  getAll(): Lobby[] {
    return this.lobbies;
  }

  getById(id: string): LobbyWithMembers | undefined {
    return this.lobbies.find(l => l.id === id);
  }

  update(id: string, data: Partial<Lobby>): void {
    const idx = this.lobbies.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.lobbies[idx] = { ...this.lobbies[idx], ...data };
    }
  }

  delete(id: string): void {
    this.lobbies = this.lobbies.filter(l => l.id !== id);
  }

  getSortedMembers(lobbyId: string): Member[] {
    const lobby = this.getById(lobbyId);
    if (!lobby) return [];
    return [...lobby.members].sort((a, b) => {
      const aFirst = a.nickname.charAt(0);
      const bFirst = b.nickname.charAt(0);
      const aIsLetter = /[a-zA-Z]/.test(aFirst);
      const bIsLetter = /[a-zA-Z]/.test(bFirst);
      // Números y caracteres especiales primero
      if (!aIsLetter && bIsLetter) return -1;
      if (aIsLetter && !bIsLetter) return 1;
      return a.nickname.localeCompare(b.nickname, undefined, { sensitivity: 'base' });
    });
  }
}
