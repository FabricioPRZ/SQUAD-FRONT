import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Group {
  id: string;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() groupSelected = new EventEmitter<Group>();

  activeGroupId: string | null = null;

  groups: Group[] = [
    { id: '1', name: 'Final Fantasy VII', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg' },
    { id: '2', name: 'DOOM', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/5/57/Doom_cover_art.jpg' },
    { id: '3', name: 'Halo 4', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/92/Halo_4_box_art.png' },
    { id: '4', name: 'Super Mario 64', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Super_Mario_64_box_cover.jpg' }
  ];

  selectGroup(group: Group) {
    // Si se vuelve a hacer clic en el mismo grupo, se cierra el chat
    if (this.activeGroupId === group.id) {
      this.activeGroupId = null;
      this.groupSelected.emit({ id: '', name: '', imageUrl: '' }); // señal de cierre
    } else {
      this.activeGroupId = group.id;
      this.groupSelected.emit(group);
    }
  }

  onCreateGroup() {
    console.log('Navegando a creación de grupos...');
  }
}
