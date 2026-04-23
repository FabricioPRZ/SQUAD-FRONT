import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SidebarComponent, Group } from '../../../../shared/components/sidebar/sidebar.component';
import { UserSidebarComponent } from '../../../../shared/components/user-sidebar/user-sidebar.component';
import { ChatComponent } from '../chat/chat.component';
import { HomeViewModelService } from '../../viewmodels/home-view-model.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, SidebarComponent, UserSidebarComponent, ChatComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  selectedGroup = signal<Group | null>(null);

  constructor(public vm: HomeViewModelService) {}

  onGroupSelected(group: Group) {
    if (group.id) {
      this.selectedGroup.set(group);
    } else {
      this.selectedGroup.set(null);
    }
  }

  onUserOption(id: string) {
    console.log('Opción de usuario seleccionada:', id);
  }
}
