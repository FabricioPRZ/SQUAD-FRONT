import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { CardComponent, Post } from '../../../../shared/components/card/card.component';
import { ChatComponent } from '../../pages/chat/chat.component';
import { UserSidebarComponent } from '../../../../shared/components/user-sidebar/user-sidebar.component';
import { Group } from '../../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, CardComponent, ChatComponent, UserSidebarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedGroup: Group | null = null;

  get isChatOpen(): boolean {
    return this.selectedGroup !== null && this.selectedGroup.id !== '';
  }

  onGroupSelected(group: Group) {
    if (!group.id) {
      this.selectedGroup = null;
    } else {
      this.selectedGroup = group;
    }
  }

  closeChat() {
    this.selectedGroup = null;
  }

  onUserOption(id: string) {
    console.log('Opción de usuario seleccionada:', id);
  }

  posts: Post[] = [
    { id: 1, imageUrl: '', userAvatar: '', username: 'Chocobo_Drift',
      groupImage: 'https://api.dicebear.com/7.x/identicon/svg?seed=DoomGroup',
      groupName: 'DOOM Fans', timestamp: 'Hace 9 horas', saved: false },
    { id: 2, imageUrl: '', userAvatar: '', username: 'NightWolf_99',
      groupImage: 'https://api.dicebear.com/7.x/identicon/svg?seed=CyberpunkCrew',
      groupName: 'Cyberpunk Crew', timestamp: 'Hace 2 horas', saved: true },
    { id: 3, imageUrl: '', userAvatar: '', username: 'StarLord_GG',
      groupImage: 'https://api.dicebear.com/7.x/identicon/svg?seed=ProGamers',
      groupName: 'Pro Gamers', timestamp: 'Hace 5 horas', saved: false }
  ];
}
