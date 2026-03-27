import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MenuOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  route?: string;
}

@Component({
  selector: 'app-user-menu-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-menu-modal.component.html',
  styleUrls: ['./user-menu-modal.component.css']
})
export class UserMenuModalComponent {
  @Input() isOpen: boolean = false;
  @Input() userName: string = 'Usuario';
  @Input() userEmail: string = 'usuario@email.com';
  @Input() userAvatar: string = 'https://i.pravatar.cc/150?img=12';
  @Output() closed = new EventEmitter<void>();
  @Output() optionSelected = new EventEmitter<string>();
  @Output() logoutRequested = new EventEmitter<void>();

  menuOptions: MenuOption[] = [
    {
      id: 'edit-profile',
      label: 'Editar perfil',
      description: 'Cambiar avatar, contraseña y nombre',
      icon: 'profile',
      color: '#C1119F'
    },
    {
      id: 'lobbys',
      label: 'Lobbys',
      description: 'Administrar, editar, eliminar y abandonar',
      icon: 'group',
      color: '#D9006C'
    },
    {
      id: 'saved',
      label: 'Guardados',
      description: 'Administrar publicaciones guardadas',
      icon: 'bookmark',
      color: '#22c55e'
    }
  ];

  close(): void {
    this.closed.emit();
  }

  selectOption(optionId: string): void {
    this.optionSelected.emit(optionId);
    this.close();
  }

  logout(): void {
    this.logoutRequested.emit();
    this.close();
  }
}
