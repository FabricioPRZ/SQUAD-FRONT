import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ChatComponent } from '../../pages/chat/chat.component';
import { UserSidebarComponent } from '../../../../shared/components/user-sidebar/user-sidebar.component';
import { HomeViewModelService } from '../../viewmodels/home-view-model.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, CardComponent, ChatComponent, UserSidebarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(public vm: HomeViewModelService) {}

  get isChatOpen(): boolean {
    const group = this.vm.selectedGroup();
    return group !== null && group.id !== '';
  }

  onUserOption(id: string) {
    console.log('Opción de usuario seleccionada:', id);
  }
}
