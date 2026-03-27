import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent {
  @Output() optionSelected = new EventEmitter<string>();

  userName = 'Fernando';
  userEmail = '233373@ids.upchiapas.edu.mx';
  userAvatarUrl = 'https://i.pravatar.cc/150?img=12';

  selectOption(id: string) {
    this.optionSelected.emit(id);
  }
}
